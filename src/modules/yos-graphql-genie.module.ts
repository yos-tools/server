import { IResolvers, ITypedef, PubSub } from 'apollo-server';
import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import { GraphQLGenie } from 'graphql-genie';
import authPlugin from 'graphql-genie-authentication';
import subscriptionPlugin from 'graphql-genie-subscriptions';
import * as _ from 'lodash';
import { YosFilterHook, YosGraphQLGenieModuleConfig, YosHelper, YosHooksService, YosModule, YosServer } from '..';
import mergeSchemas from '../../node_modules/graphql-tools/dist/stitching/mergeSchemas';

export class YosGraphQLGenieModule extends YosModule {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /**
   * Configuration of YosGraphQLGenieModule
   */
  protected _config: YosGraphQLGenieModuleConfig;

  /**
   * GraphQLGenie instance
   */
  protected _genie: GraphQLGenie;


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

    this._yosServer = yosServer;
    this._config = YosHelper.specialMerge(this._config, config);

    // Add hook filter for GraphQL schema
    const hooksService: YosHooksService = _.get(this.yosServer, 'services.hooksService');
    if (hooksService) {
      hooksService.addFilter(YosFilterHook.GraphQLSchema, {
        func: this.integrateGenieSchema.bind(this), id: 'YosGraphQLGenieModule.integrateGenieSchema'
      });
    }

    // Return module instance
    return this;
  }


  // ===================================================================================================================
  // Hook functions
  // ===================================================================================================================

  /**
   * Integrate GraphQL Genie schema into GraphQL schema
   * @param schema
   * @param config
   */
  public async integrateGenieSchema(
    schema: GraphQLSchema,
    config: {
      autoTypeDefs: ITypedef,
      typeDefs: ITypedef,
      resolvers: IResolvers,
      schemaDirectives: { [name: string]: typeof SchemaDirectiveVisitor }
    }
  ) {

    // Init genie if not exists
    if (!this._genie) {

      // Check fortuneOptions
      const fortuneOptions = _.get(this._yosServer, 'config.core.fortune');
      if (!fortuneOptions) {
        throw new Error('Missing fortune configuration in core.fortune. Check the configuration file(s).');
      }

      // Init GraphQL Genie
      this._genie = new GraphQLGenie({
        fortuneOptions: fortuneOptions,
        generatorOptions: this._config.generatorOptions,
        typeDefs: config.autoTypeDefs.toString(),
        schemaBuilder: this._config.schemaBuilder
      });

      // Add plugins
      await this.addPlugins();
    }

    // Return integrated genie schema
    return mergeSchemas({
      schemas: [schema, this._genie.getSchema()]
    });
  }


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

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


