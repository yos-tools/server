import { YosSchemaDefinition } from '..';


// Init
const packageJson = require('../../package.json');
const env: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const name = packageJson.name;
const version = packageJson.version;


/**
 * Core API of yos-server
 * @type {YosSchemaDefinition}
 */
export const YosCoreApi: YosSchemaDefinition = {

  // ===================================================================================================================
  // Type definitions
  // ===================================================================================================================

  typeDefs: `
    type API {
      env: String
      name: String
      version: String
    }

    type Query {
      api: API
    }
  `,

  resolvers: {
    Query: {
      api: () => {
        return {
          env: env,
          name: name,
          version: version
        };
      }
    }
  }
};
