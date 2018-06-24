import { ApolloServer, ServerRegistration } from 'apollo-server-express';
import { YosCoreApi, YosGraphQLModuleConfig, YosHelper, YosModule, YosServer } from '..';

/**
 * GraphQL module for yos-server
 */
export class YosGraphQLModule extends YosModule {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  // Module configuration is set automatically
  protected _config: YosGraphQLModuleConfig;

  // Apollo server
  protected _apolloServer: ApolloServer;

  // Apollo server config
  protected _apolloServerRegistration: ServerRegistration;


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Initialization of a new YosGraphQLModule
   * @param {YosServer} yosServer
   * @param {YosGraphQLModuleConfig} config
   * @returns {YosGraphQLModule}
   */
  public static init(yosServer: YosServer, config: YosGraphQLModuleConfig): YosGraphQLModule {

    // Init
    const yosGraphQLModule = new YosGraphQLModule(yosServer, config);

    // Load schemas

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
        typeDefs: YosCoreApi.typeDefs,

        // Set resolvers
        resolvers: YosCoreApi.resolvers,

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
    this._yosServer.services.hooksService.addAction('afterServerStart', {
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
      this._yosServer.services.hooksService.addAction('afterServerStart', {
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
}
