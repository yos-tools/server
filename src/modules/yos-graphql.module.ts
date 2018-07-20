import { ApolloServer, ServerRegistration } from 'apollo-server-express';
import { DefinitionNode, parse, print } from 'graphql';
import { IResolvers, ITypedef } from 'graphql-tools';
import * as _ from 'lodash';
import {
  YosActionHook,
  YosGraphQLModuleConfig,
  YosGraphQLSchemasConfigType,
  YosHelper,
  YosInitializer,
  YosModule,
  YosSchemaDefinition,
  YosServer
} from '..';

const {transpileSchema} = require('graphql-s2s').graphqls2s;

/**
 * GraphQL module for yos-server
 */
export class YosGraphQLModule extends YosModule {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /** Apollo server */
  protected _apolloServer: ApolloServer;

  /** Apollo server config */
  protected _apolloServerRegistration: ServerRegistration;

  /** Module configuration is set automatically */
  protected _config: YosGraphQLModuleConfig;

  /** GraphQL resolvers */
  protected _resolvers: IResolvers;

  /** GraphQL type definitions */
  protected _typeDefs: ITypedef;


  // ===================================================================================================================
  // Public Methods
  // ===================================================================================================================

  /**
   * Initialization of a new YosGraphQLModule
   * @param {YosServer} yosServer
   * @param {YosGraphQLModuleConfig} config
   * @returns {YosGraphQLModule}
   */
  public static async init(yosServer: YosServer, config: YosGraphQLModuleConfig): Promise<YosGraphQLModule> {

    // Init
    const yosGraphQLModule = new YosGraphQLModule(yosServer, config);

    // Initialize GraphQL schemas
    await yosGraphQLModule.initGraphQLSchemas();

    // Initialize apollo server
    yosGraphQLModule.initApolloServer();

    // Apply middleware, incl. subscriptions and playground, if desired
    yosGraphQLModule.applyMiddleware();

    // System log
    yosGraphQLModule.systemLog();

    // Return module
    return yosGraphQLModule;
  }

  /**
   * Get GraphQL schema definition form objects or files
   * @param {YosGraphQLSchemasConfigType} items Object(s) or file and directory path string(s)
   * @returns {Promise<YosSchemaDefinition>}
   */
  public static async getGraphQLSchemaDefinition(items: YosGraphQLSchemasConfigType): Promise<{ typeDefs: ITypedef[], resolvers: IResolvers[] }> {

    // Init
    let schemas: YosSchemaDefinition[] = [];
    const definition: { typeDefs: ITypedef[], resolvers: IResolvers[] } = {typeDefs: [], resolvers: []};

    // Convert to array for
    if (!Array.isArray(items)) {
      items = [<any>items];
    }

    // Process all items
    for (const item of items) {

      // For file or directory path string
      if (typeof item === 'string') {
        const fileArray = await YosInitializer.requireFiles(item);

        // For required files
        for (const file of fileArray) {

          // For objects in file
          for (const name of Object.getOwnPropertyNames(file)) {
            const object = file[name];

            // Check object
            if ((typeof object.typeDefs === 'string' && object.typeDefs.length) || object.resolvers) {

              // Add schema
              schemas.push(object);
            }
          }
        }
      }

      // For YosSchemaDefinition
      else if (item) {
        schemas.push(item);
      }
    }

    // Process schemas
    if (schemas.length) {
      for (const schema of schemas) {

        // Process typeDefs
        if (Array.isArray(schema.typeDefs)) {
          definition.typeDefs = definition.typeDefs.concat(schema.typeDefs);
        } else {
          definition.typeDefs.push(schema.typeDefs);
        }

        // Process resolvers
        if (Array.isArray(schema.resolvers)) {
          definition.resolvers = definition.resolvers.concat(schema.resolvers);
        } else {
          definition.resolvers.push(schema.resolvers);
        }
      }
    }

    // Return schema definition
    return definition;
  }

  /**
   * Merge GraphQL type definitions
   * @param {string | string[]} definitions
   * @returns {string}
   */
  public static mergeGraphQLTypeDefinitions(definitions: string | string[]): string {

    // Convert array to string
    if (Array.isArray(definitions)) {
      definitions = definitions.toString();
    }

    // Convert definitions string into a GraphQL document node
    const documentNode = <any> parse(definitions);

    // Init associated array for fields (e.g. "id") for every named type (e.g. "User")
    const typeFields: { [type: string]: { [field: string]: any } } = {};

    // Init associated array for named definitions
    const typeDefinitions: { [type: string]: any } = {};

    // 1. Round: collect definitions and all fields for each type (with names)
    // If elements with the same name exist, the last one is used
    for (const definition of documentNode.definitions) {

      // Check type name
      if (!_.get(definition, 'name.value', '').length) {
        continue;
      }

      // Get type
      const type = definition.name.value;
      typeDefinitions[type] = definition;

      // Check if the definition has fields
      if (!Array.isArray(definition.fields)) {
        continue;
      }

      // Init fields of type, if not exist
      if (!typeFields[type]) {
        typeFields[type] = {};
      }

      // Collect all fields of type (existing ones are overwritten)
      for (const field of definition.fields) {
        typeFields[type][field.name.value] = field;
      }

    }

    // Init new definition nodes
    const definitionNodes: DefinitionNode[] = [];

    // 2. Round: merge definitions
    // Types with fields are replaced by those created above and duplicates are eliminated
    for (const definition of documentNode.definitions) {

      // Check type name
      if (!_.get(definition, 'name.value', '').length) {

        // Add unnamed definition
        definitionNodes.push(definition);

        continue;
      }

      // Get type
      const type = definition.name.value;

      // Check if the type has already been processed
      if (!typeDefinitions.hasOwnProperty(type)) {
        continue;
      }

      // Get last definition of named type
      const lastDefinitionOfType = typeDefinitions[type];

      // Set fields
      lastDefinitionOfType.fields = Object.values(typeFields[type]);

      // Add named definition
      definitionNodes.push(lastDefinitionOfType);

      // Remove definition from typeDefinition
      delete typeDefinitions[type];
    }

    // Set new definition nodes
    documentNode.definitions = definitionNodes;

    // Return string with merged GraphQL type definitions
    return print(documentNode);
  }


  // ===================================================================================================================
  // Protected Methods
  // ===================================================================================================================

  /**
   * Initialize GraphQL schemas
   * @returns {Promise<void>}
   */
  protected async initGraphQLSchemas() {

    // Get definitions
    const definitions = await Promise.all([this._config.coreSchemas, this._config.schemas].map(
      async (item) => {
        return await YosGraphQLModule.getGraphQLSchemaDefinition(item);
      }
    ));

    // Concat definitions to one definition
    const definition = {
      typeDefs: definitions[0].typeDefs.concat(definitions[1].typeDefs),
      resolvers: definitions[0].resolvers.concat(definitions[1].resolvers)
    };

    // Add GraphQL Schema support for type inheritance, generic typing, metadata decoration
    // (https://github.com/nicolasdao/graphql-s2s)
    const transpiledTypeDefs = transpileSchema(definition.typeDefs.toString());

    // Merge typeDefs
    this._typeDefs = YosGraphQLModule.mergeGraphQLTypeDefinitions(transpiledTypeDefs);

    // Merge resolvers
    this._resolvers = _.merge({}, ...definition.resolvers);
  }

  /**
   * Initialization of apollo server
   * @returns {ApolloServer}
   */
  protected initApolloServer() {

    // Take server from configuration if exists
    this._apolloServer = this._config.apolloServer;

    // Create new server
    if (!this._apolloServer) {
      this._apolloServer = new ApolloServer(YosHelper.specialMerge({

        // Set type definitions
        typeDefs: this._typeDefs,

        // Set resolvers
        resolvers: this._resolvers,

        // Set context
        context: () => {
          return {
            yosServer: this._yosServer
          };
        }

        // Combine with configuration
      }, this._config.apolloConfig));
    }

    // Return configured or new server
    return this._apolloServer;
  }


  /**
   * Apply apollo server to express app
   */
  protected applyMiddleware() {

    // Check apolloServer
    if (!this._apolloServer) {
      this.initApolloServer();
    }

    // Init
    const graphqlUrl = YosHelper.prepareUrl(this._config.url, 'graphql', true);

    // Configuration for apollo
    const apolloConfig: ServerRegistration = {
      app: this._yosServer.expressApp,
      path: graphqlUrl,
      gui: false
    };

    // Check playground
    if (this._config.playground) {

      // Enable playground gui
      apolloConfig.gui = true;
    }

    // Enable subscriptons
    if (this._config.subscriptions) {
      const subscriptionsUrl = YosHelper.prepareUrl(this._config.subscriptions, 'subscriptions', true);
      apolloConfig.gui = {subscriptionEndpoint: `ws://${this._yosServer.hostname}:${this._yosServer.port + subscriptionsUrl}`};
    }

    // Add apollo server
    this._apolloServer.applyMiddleware(apolloConfig);

    // Set config
    this._apolloServerRegistration = apolloConfig;
  }

  /**
   * System log
   */
  protected systemLog() {

    // Add action for GraphQL start
    this._yosServer.services.hooksService.addAction(YosActionHook.AfterServerStart, {
      id: 'graphQLStart',
      priority: 10,
      func: () => {
        let str = 'GraphQL ';
        if (this._config.playground) {
          str += '(incl. Playground) ';
        }
        str += 'started: ';
        console.log(str + this._yosServer.url + this._apolloServer.graphqlPath);
      }
    });

    // Add action for GraphQL subbstriptions start
    if (this._config.subscriptions) {
      this._yosServer.services.hooksService.addAction(YosActionHook.AfterServerStart, {
        id: 'graphQLSubscriptionStart',
        priority: 10,
        func: () => {
          console.log('GraphQL subscriptions: ' + (<any>this._apolloServerRegistration.gui).subscriptionEndpoint);
        }
      });
    }
  }


  // ===================================================================================================================
  // Getter & Setter
  // ===================================================================================================================

  /**
   * Getter for apollo server
   * @returns {ApolloServer}
   */
  public get apolloServer(): ApolloServer {
    return this._apolloServer;
  }

  /**
   * Getter for apollo server registration
   * @returns {ServerRegistration}
   */
  public get apolloServerRegistration(): ServerRegistration {
    return this._apolloServerRegistration;
  }

  /**
   * Getter for GraphQL schema resolvers
   * @returns {IResolvers}
   */
  public get resolvers(): IResolvers {
    return this._resolvers;
  }

  /**
   * Getter for GraphQL schema type definitions
   * @returns {ITypedef}
   */
  public get typeDefs(): ITypedef {
    return this._typeDefs;
  }
}
