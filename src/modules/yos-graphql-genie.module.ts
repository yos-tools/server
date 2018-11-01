import { AuthenticationError, ForbiddenError, IResolvers, ITypedef, PubSub } from 'apollo-server';
import { SchemaDirectiveVisitor } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import { assertObjectType, GraphQLSchema, parse, print } from 'graphql';
import { getRecordFromResolverReturn, GraphQLGenie } from 'graphql-genie';
import authPlugin from 'graphql-genie-authentication';
import subscriptionPlugin from 'graphql-genie-subscriptions';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import {
  YosAuthenticationService,
  YosControllerContext,
  YosFilterHook,
  YosGraphQLGenieModuleConfig,
  YosHelper,
  YosHooksService,
  YosModule,
  YosRole,
  YosServer,
  YosSetUserViaTokenConfig,
  YosStore, YosUser
} from '..';
import mergeSchemas from '../../node_modules/graphql-tools/dist/stitching/mergeSchemas';

export class YosGraphQLGenieModule extends YosModule {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /** Authentication service */
  protected _authenticationService: YosAuthenticationService;

  /** Configuration of YosGraphQLGenieModule */
  protected _config: YosGraphQLGenieModuleConfig;

  /** GraphQLGenie instance */
  protected _genie: GraphQLGenie;

  /** Hook service */
  protected _hooksService: YosHooksService;


  // ===================================================================================================================
  // Init
  // ===================================================================================================================

  /**
   * Init of GraphQL Genie Module
   *
   * HINT: Must be initialized before GraphQL Module so that the schema is integrated by the hook
   *
   * @param yosServer
   * @param config
   */
  public init(yosServer: YosServer, config: YosGraphQLGenieModuleConfig = <any>{}): YosGraphQLGenieModule {

    // Set context
    this._yosServer = yosServer;
    this._config = YosHelper.specialMerge(this._config, config);

    // Set service
    this.setServices();

    // Integrate GraphQL Genie into schema via hook
    this._hooksService.addFilter(YosFilterHook.GraphQLSchema, {
      func: this.integrateGenieSchema.bind(this), id: 'YosGraphQLGenieModule.integrateGenieSchema'
    });

    // Return module instance
    return this;
  }


  // ===================================================================================================================
  // Hook functions
  // ===================================================================================================================

  /**
   * Integrate GraphQL Genie schema into GraphQL schema
   */
  public async integrateGenieSchema(
    config: {
      typeDefs: ITypedef,
      resolvers: IResolvers,
      schemaDirectives: { [name: string]: typeof SchemaDirectiveVisitor }
    }
  ) {

    // Split type definitions
    const split = this.splitTypeDefs(config.typeDefs.toString());

    // Init genie if not exists
    if (!this._genie) {

      // Check fortuneOptions
      const fortuneOptions = _.get(this._yosServer, 'config.core.fortune');
      if (!fortuneOptions) {
        throw new Error('Missing fortune configuration in core.fortune. Check the configuration file(s).');
      }

      // Init GraphQL Genie with typeDefs from config
      this._genie = new GraphQLGenie({
        fortuneOptions: fortuneOptions,
        generatorOptions: this._config.generatorOptions,
        typeDefs: split.genie,
        schemaBuilder: this._config.schemaBuilder
      });

      // Update fortune store
      await YosStore.assignStore(this._genie.getDataResolver().getStore());

      // Add filter
      this.setFilters();

      // Initialize authentication handling
      // Must be processed before authPlugin is started because authenticate function is not set in context yet
      await this.prepareAuthPlugin();

      // Add plugins
      await this.addPlugins();
    }

    // Return integrated genie schema
    const authSchema = this.getSchemaWithAuth();

    // Add resolvers and schema directives from config
    return mergeSchemas({
      schemas: [split.rest, authSchema],
      resolvers: config.resolvers ? config.resolvers : [],
      schemaDirectives: config.schemaDirectives ? config.schemaDirectives : {}
    });
  }


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================


  /**
   * Split type definitions into genie and rest definitions
   * @param definitions
   */
  protected splitTypeDefs(definitions: string | string[]): { genie: string, rest: string } {

    // Convert array to string
    if (Array.isArray(definitions)) {
      definitions = definitions.toString();
    }

    // Convert definitions string into a GraphQL document node
    const documentNode = <any> parse(definitions);

    // Init
    const genie: any = {kind: 'Document', definitions: []};
    const rest: any = {kind: 'Document', definitions: []};
    const restTypes: string[] = ['InputObjectTypeDefinition'];

    // Split documentNode into genie and rest schema
    for (const definition of documentNode.definitions) {
      if (
        // Queries, because they will be processed by own resolvers
        definition.name && definition.name.value === 'Query' ||

        // special rest types
        restTypes.indexOf(definition.kind) >= 0 ||

        // ObjectTypeDefinitions without "model" or "genie" decorator
        definition.kind === 'ObjectTypeDefinition' &&
        !_.find(definition.directives, ['name.value', 'model']) &&
        !_.find(definition.directives, ['name.value', 'genie'])
      ) {

        // Push into rest
        rest.definitions.push(definition);

      } else {

        // Push into genie
        genie.definitions.push(definition);
      }
    }

    // Return genie and rest schema as strings
    return {genie: print(genie), rest: print(rest)};
  }

  /**
   * Set services
   */
  protected setServices() {

    // Set authentication service
    this._authenticationService = _.get(this.yosServer, 'services.authenticationService');
    if (!this._authenticationService) {
      throw Error('Missing instance of AuthenticationService in ' + YosHelper.getClassName(this));
    }

    // Check hooks service
    this._hooksService = _.get(this.yosServer, 'services.hooksService');
    if (!this._hooksService) {
      throw Error('Missing instance of HookService in ' + YosHelper.getClassName(this));
    }
  }

  /**
   * Add GraphQL Genie plugins
   */
  protected async addPlugins() {

    // Authentication plugin
    await this._genie.use(authPlugin());

    // Subscription plugin
    const pubSub: PubSub = _.get(this._yosServer, 'services.services.subscriptionService.pubSub');
    if (this._config.subscriptions && pubSub) {
      await this._genie.use(subscriptionPlugin(pubSub));
    }
  }

  /**
   * Initialize authentication handling for GraphQL Genie
   *
   * HINT: Must be processed before authPlugin because authenticate function is not set in context yet
   *
   * See https://github.com/genie-team/graphql-genie/blob/master/examples/apollo-server2-redis-jwt-auth/src/main.ts
   */
  protected async prepareAuthPlugin() {

    // Init and check email address of admin
    const adminEmail = _.get(this._yosServer.config, 'core.authorization.adminEmail');
    if (!adminEmail) {
      throw new Error('Missing core.authorization.adminEmail in configuration');
    }

    // Init and check password of admin
    const adminPassword = _.get(this._yosServer.config, 'core.authorization.adminPassword');
    if (!adminPassword) {
      throw new Error('Missing core.authorization.adminPassword in configuration');
    }

    // Check secret or private key of JWT
    if (!_.get(this._yosServer.config, 'core.authorization.jwt.secretOrPrivateKey')) {
      throw new Error('Missing core.authorization.jwt.secretOrPrivateKey in configuration');
    }

    // Set data resolver
    const dataResolver = this.genie.getDataResolver();

    // Setup a basic admin user using genie import data function
    // to do so we will use the compute ID function of the data resolver
    // this is necessary because genie has the type encoded in the id
    const adminUserID = dataResolver.computeId('User', 'admin');
    const password = bcrypt.hashSync('admin', 10);

    // If we base the ID on the user id then we don't have to do a find for updates
    const userIdentifierID = dataResolver.computeId('UserIdentifiers', dataResolver.getOriginalIdFromObjectId(adminUserID));

    // Initialize admin
    await this.genie.importRawData([
      {
        id: adminUserID,
        username: 'Admin',
        email: adminEmail,
        password: password,
        roles: [YosRole.Admin, YosRole.User],
        __typename: 'User'
      },
      {
        id: userIdentifierID,
        userID: adminUserID,
        password: password,
        roles: [YosRole.Admin, YosRole.User],
        identifiers: ['admin', adminEmail],
        __typename: 'UserIdentifiers'
      }
    ], true);

    // Add a hook to encrypt passwords when a user is created/updated
    dataResolver.addInputHook('User', (context, record, update) => {
      switch (context.request.method) {
        case 'create':
          if (record.password) {
            record.password = bcrypt.hashSync(record.password, 10);
          }
          return record;
        case 'update':
          if (update.replace.password) {
            update.replace.password = bcrypt.hashSync(update.replace.password, 10);
          }
          return update;
      }
    });

    // Add a hook so the UserIdentifiers db stays up to date
    dataResolver.addOutputHook('User', async (context, record) => {
      const method = context.request.method;
      const id = dataResolver.computeId('UserIdentifiers', dataResolver.getOriginalIdFromObjectId(record.id));
      const username = record.username ? record.username.toLowerCase() : null;
      const email = record.email ? record.email.toLowerCase() : null;
      const identifiers = [];
      if (username) {
        identifiers.push(username);
      }
      if (email) {
        identifiers.push(email);
      }

      const meta = {
        context: {
          authenticate: () => true
        }
      };

      switch (method) {
        case 'update':
        case 'create':

          // Make the record for UserIdentifiers
          const idRecord = {
            id,
            userID: record.id,
            identifiers,
            password: record.password,
            roles: record.roles
          };
          await (<any>dataResolver)[method]('UserIdentifiers', idRecord, meta);
          return record;
        case 'delete':
          await dataResolver.delete('UserIdentifiers', [id], meta);
          return record;
      }
    });
  }

  /**
   * Get schema with authentication features
   */
  protected getSchemaWithAuth(): GraphQLSchema {

    // Make the createUser mutation login the user;
    const schema = this._genie.getSchema();
    const createUserField = assertObjectType(schema.getType('Mutation')).getFields()['createUser'];
    const createUserResolver = createUserField.resolve;
    createUserField.resolve = async function (record, args, context, info) {
      const createdUser = await createUserResolver.apply(this, [record, args, context, info]);
      if (createdUser) {

        // Don't change user if logged
        if (context && context.hasOwnProperty('context.user') && _.isEmpty(context.context.user)) {

          // The mutate resolver will return with other metadata but we just want the actual record
          const userData = getRecordFromResolverReturn(createdUser);
          context.context.user['id'] = userData['id'];
          context.context.user['roles'] = userData['roles'];
        }

      }
      return createdUser;
    };

    // Get configuration
    const secretOrPrivateKey = _.get(this._yosServer.config, 'core.authorization.jwt.secretOrPrivateKey');
    const options = _.get(this._config, 'core.authorization.jwt.options');

    // create the new queries/mutations and resolvers
    return mergeSchemas({
      schemas: [
        schema,
        `extend type Mutation {
          login(identifier: String!, password: String!): ID
        }
        extend type UserPayload {
          """
          Provided on signup (createUser mutation)
          """
          jwt: String
        }`
      ],
      resolvers: {
        UserPayload: {
          jwt: {
            fragment: `... on UserPayload { id, roles }`,
            resolve(_record, _args, context, _info) {
              let token;
              if (context && !_.isEmpty(context.context.user)) {
                token = jwt.sign(
                  _.pick(context.context.user, ['id', 'roles']),
                  secretOrPrivateKey,
                  options
                );
              }
              return token;
            }
          }
        },
        Mutation: {
          login: async (_, {identifier, password}) => {

            identifier = identifier.toLowerCase();
            const identifiedUser = await this.genie.getDataResolver().find('UserIdentifiers', undefined, {
              match: {
                identifiers: identifier
              }
            });
            if (!_.isEmpty(identifiedUser)) {
              if (bcrypt.compareSync(password, identifiedUser[0].password)) {

                // Set HTTP Headers to { "authorization": "Bearer ${accessToken} }
                return jwt.sign(
                  {
                    id: identifiedUser[0].userID,
                    roles: identifiedUser[0].roles
                  },
                  secretOrPrivateKey,
                  options
                );
              }
              throw new AuthenticationError('Incorrect password.');
            }
            throw new AuthenticationError('No such User exists.');
          }
        }
      }
    });
  }

  /**
   * Set filters
   */
  protected setFilters() {

    // Set user in request context via filter
    this._hooksService.addFilter(YosFilterHook.IncomingRequestContext, {
      id: 'YosAuthenticationModule.setUserViaToken',
      func: this.extendContext.bind(this),
      config: {overwrite: false}
    });

    // Set user in GraphQL context via filter
    this._hooksService.addFilter(YosFilterHook.GraphQLContext, {
      id: 'YosAuthenticationModule.setUserViaToken',
      func: this.extendContext.bind(this)
    });
  }

  /**
   * Extend Context
   * @param context
   * @param config
   */
  protected async extendContext(context: YosControllerContext, config: YosSetUserViaTokenConfig = {overwrite: true}) {

    // Init
    const secretOrPrivateKey = _.get(this._config, 'core.authorization.jwt.secretOrPrivateKey');
    const bearer = this.parseAuthorizationBearer(context.req || context.connection);

    // Get current user
    if (bearer && _.get(config, 'overwrite')) {
      context.user = (await YosUser.find((<any> jwt.verify(bearer, secretOrPrivateKey)).id)).payload.records[0];
    }

    // Add Authenticate function
    context.authenticate = (
      method: string,
      allowedRoles: { [method: string]: string [], create?: string[]; read?: string[]; update?: string[]; delete?: string[]; rules?: string[] },
      records: { [key: string]: any }[],
      filterRecords: { [key: string]: any }[],
      updates: { id: string, replace?: {}, push?: {}, pull?: {} },
      typeName: string,
      fieldName: string
    ) => {

      // Init
      const currentUser = context.user;
      const requiredRolesForMethod: string[] = allowedRoles[method];
      const rules: string[] = allowedRoles.rules || [];
      const currentRoles = !_.isEmpty(currentUser) ? currentUser['roles'] : [];
      records = records || [];

      // Admin is allowed to do everything
      if (currentRoles.includes(YosRole.Admin)) {
        return true;
      }

      // Custom rules
      records.forEach(record => {
        rules.forEach(rule => {

          // Users shouldn't be able to create themselves with any other role than USER
          if (['create', 'update'].includes(method) && rule.includes('only:')) {
            const allowedValue = rule.split(':')[1];
            if (record[fieldName]) {
              if (_.isArray(record[fieldName])) {
                if (record[fieldName].length > 1 || record[fieldName][0] !== allowedValue) {
                  throw new ForbiddenError(`${fieldName} must be [${allowedValue}]`);
                }
              } else if (record[fieldName] !== allowedValue) {
                throw new ForbiddenError(`${fieldName} must be ${allowedValue}`);
              }
            }
          } else if (rule === 'SELF') {

            // Users shouldn't be able to set property other than to themselves
            if (['create', 'update'].includes(method)) {
              if (_.isEmpty(currentUser)) {
                throw new ForbiddenError(`Must be logged in to set ${fieldName}`);
              } else if (record[fieldName] && record[fieldName] !== currentUser['id']) {
                throw new ForbiddenError(`${fieldName} field must be set to logged in USER`);
              }
            }
          }
        });
      });

      if (requiredRolesForMethod.includes(YosRole.Any)) {
        return true;
      }

      // The !isEmpty(record) may result in saying to permission even if it's actually just an empty result
      // but it could be a security flaw that allows people to see what "OWNER" fields don't exist otherwise
      if (requiredRolesForMethod.includes(YosRole.Owner) && !_.isEmpty(currentUser) && !_.isEmpty(records)) {
        const userIds = this.getUserIDsOfRequestedData(records, filterRecords);
        if (userIds.size === 1 && userIds.values().next().value === currentUser.id) {
          return true;
        }
      }

      // Check if currentRoles has any of the required Roles
      const hasNecessaryRole = requiredRolesForMethod.some((role: YosRole) => {
        return currentRoles.includes(role);
      });
      if (!hasNecessaryRole) {
        if (fieldName) {
          throw new AuthenticationError(`Not authorized to ${method} ${fieldName} on type ${typeName}`);
        } else {
          throw new AuthenticationError(`Not authorized to ${method} ${typeName}`);
        }
      }
      return true;

    };

    // Return context
    return context;
  }

  /**
   * Parse authorization bearer from header
   * @param params
   */
  public parseAuthorizationBearer(params: any) {

    // Get authorization from header
    let authorization = params.headers && params.headers.authorization;
    authorization = authorization ? authorization : params.context && params.context.authorization;

    // Check authorization
    if (!authorization) {
      return;
    }

    // Get bearer
    const headerParts = authorization.split(' ');
    if (headerParts[0].toLowerCase() === 'bearer' || headerParts[0].toLowerCase() === 'bearer') {
      return headerParts[1];
    }
  }

  /**
   * Get user ids of requested Data
   */
  public getUserIDsOfRequestedData =
    (records: { [key: string]: any }[], filterRecords: { [key: string]: any }[]): Set<string> => {

      // Init
      const userIDs = new Set<string>();
      records.push(filterRecords);

      // Get ids
      try {
        records = _.isArray(records) ? records : [records];
        records.forEach(record => {
          if (record['__typename'] === 'User') {
            userIDs.add(record['id']);
          } else if (record['__typename'] === 'Post' && record['author']) {
            userIDs.add(record['author']);
          }
        });
      } catch (e) {
        // Empty by design
      }

      // Return ids
      return userIDs;
    };


  // ===================================================================================================================
  // Getter & Setter
  // ===================================================================================================================

  /**
   * Getter for genie
   */
  public get genie(): GraphQLGenie {
    return this._genie;
  }

  /**
   * Setter for genie
   * @param genie
   */
  public set genie(genie: GraphQLGenie) {
    this._genie = genie;
  }
}


