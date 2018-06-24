import { ApolloServer } from 'apollo-server-express';
import { ServerRegistration } from 'apollo-server-express/dist/ApolloServer';
import { YosCoreApi, YosGraphqlModuleConfig, YosHelper, YosModule, YosServer } from '..';

/**
 * GraphQL module for yos-server
 */
export class YosGraphQLModule extends YosModule {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  // Module configuration is set automatically
  protected _config: YosGraphqlModuleConfig;

  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Initialization of a new YosGraphQLModule
   * @param {YosServer} yosServer
   * @param {YosGraphqlModuleConfig} config
   * @returns {YosGraphQLModule}
   */
  public static init(yosServer: YosServer, config: YosGraphqlModuleConfig): YosGraphQLModule {

    // Init
    const yosGraphQLModule = new YosGraphQLModule(yosServer, config);
    const graphqlUrl = YosHelper.prepareUrl(yosGraphQLModule.config.url, 'graphql', true);

    // ApolloServer
    let server = yosGraphQLModule.config.apolloServer;
    if (!server) {
      server = new ApolloServer(YosHelper.specialMerge({
        typeDefs: YosCoreApi.typeDefs,
        resolvers: YosCoreApi.resolvers,
        context: () => {
          return {
            yosServer: yosGraphQLModule.yosServer,
            yosModule: yosGraphQLModule
          };
        }
      }, yosGraphQLModule._config.apolloConfig));
    }


    // Configuration for apollo
    const apolloConfig: ServerRegistration = {
      app: yosGraphQLModule.yosServer.expressApp,
      path: graphqlUrl,
      gui: false
    };

    // Check playground
    if (yosGraphQLModule.config.playground) {

      // Enable playground gui
      apolloConfig.gui = true;

      // Enable subscriptons
      if (yosGraphQLModule.config.subscriptions) {
        const subscriptionsUrl = YosHelper.prepareUrl(yosGraphQLModule.config.subscriptions, 'subscriptions', true);
        apolloConfig.gui = {subscriptionEndpoint: `ws://${yosGraphQLModule.yosServer.hostname}:${yosGraphQLModule.yosServer.port + subscriptionsUrl}`};
      }
    }

    // Add apollo server
    server.applyMiddleware(apolloConfig);

    // Add action hook
    yosGraphQLModule.yosServer.services.hooksService.addAction('afterServerStart', {
      id: 'graphQLStart',
      priority: 10,
      func: () => {
        console.log('GraphQL started: ' + yosGraphQLModule.yosServer.url + server.graphqlPath);
      }
    });

    // Return module
    return yosGraphQLModule;
  }

}
