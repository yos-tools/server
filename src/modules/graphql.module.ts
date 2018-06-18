import { ApolloServer, gql } from 'apollo-server-express';
import { ServerRegistration } from 'apollo-server-express/dist/ApolloServer';
import { HelpFunctions, YosServerModule } from '..';

const packageJson = require('../../package.json');

export class GraphQLModule extends YosServerModule {

  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  public init() {

    const env = process.env.NODE_ENV;
    const name = packageJson.name;
    const version = packageJson.version;
    const graphqlUrl = HelpFunctions.prepareUrl(this.config.url, 'graphql', true);

    // The GraphQL schema
    const typeDefs = gql`
      type API {
        env: String
        name: String
        version: String
      }

      type Query {
        api: API
      }
    `;

    // A map of functions which return data for the schema.
    const resolvers = {
      Query: {
        api: () => {
          return {
            env: env,
            name: name,
            version: version
          }
        },
      },
    };

    const server = new ApolloServer({typeDefs, resolvers});

    // Configuration for apollo
    const apolloConfig: ServerRegistration = {
      app: this.yosServer.expressApp,
      path: graphqlUrl,
      gui: false
    };

    // Check playground
    if (this.config.playground) {

      // Enable playground gui
      apolloConfig.gui = true;

      // Enable subscriptons
      if (this.config.subscriptions) {
        const subscriptionsUrl = HelpFunctions.prepareUrl(this.config.subscriptions, 'subscriptions', true);
        apolloConfig.gui = {subscriptionEndpoint: `ws://${this.yosServer.hostname}:${this.yosServer.port + subscriptionsUrl}`};
      }
    }

    // Add apollo server
    server.applyMiddleware(apolloConfig);

    // Add action hook
    this.yosServer.hooksService.addAction('afterServerStart', {
      id: 'graphQLStart',
      priority: 10,
      func: () => {
        console.log('GraphQL started: ' + this.yosServer.url + server.graphqlPath);
      }
    });
  }

}
