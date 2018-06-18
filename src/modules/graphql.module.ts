import { ApolloServer, gql } from 'apollo-server-express';
import { YosServerModule } from '..';

const packageJson = require('../../package.json');

export class GraphQLModule extends YosServerModule {

  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  public init() {

    const env = process.env.NODE_ENV;
    const name = packageJson.name;
    const version = packageJson.version;

    // The GraphQL schema
    const typeDefs = gql`
      type API {
        env: String
        name: String
        version: String
      }
    `;

    // A map of functions which return data for the schema.
    const resolvers = {
      API: {
        env: () => env,
        name: () => name,
        version: () => version
      }
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers
    });

    // Add apollo server
    server.applyMiddleware({app: this.yosServer.expressApp, path:'graphql'});

    // Add action hook
    this.yosServer.hooksService.addAction('afterServerStart', {
      id: 'graphQLModule',
      priority: 10,
      func: () => {
        console.log('GraphQL started: ' + this.yosServer.url + '/graphql');
      }
    })
  }

}
