import * as path from 'path';
import {
  YosAuthenticationService,
  YosContextModule,
  YosGraphQLGenieModule,
  YosGraphQLModule,
  YosGraphQLService,
  YosHooksService,
  YosModulesConfig,
  YosProcessModule,
  YosServerConfig,
  YosServerCoreConfig,
  YosServicesConfig,
  YosSubscriptionService
} from '..';

const mongodbAdapter = require('fortune-mongodb');

/**
 * Default yos-server configuration
 *
 * If changes are made, please also adapt the YosServerConfig interface accordingly.
 */
export class YosServerDefaultConfig implements YosServerConfig {

  /** Core */
  public core: YosServerCoreConfig = {

    /** Configuration for the authorization handling */
    authorization: {

      /** Email address of admin - must be set in the project, otherwise an error is thrown */
      adminEmail: null,

      /** Password of admin - must be set in the project, otherwise an error is thrown */
      adminPassword: null,

      /**
       * Name of the authorization field of the http header
       *
       * The standard "Authorization" leads to an error when using directory protection in an upstream server
       * (e.g. NGINX or Apache)
       */
      authorizationField: 'yos-authorization',

      /**
       * JWT configuration
       *
       * See https://github.com/auth0/node-jsonwebtoken
       */
      jwt: {

        /** Secret or private key - must be set in the project, otherwise an error is thrown */
        secretOrPrivateKey: null,

        /** Options of JSON web token **/
        options: null
      }
    },

    /** Configuration of automatic configuration handling */
    configurations: {

      /** If a configuration object is transferred, another path is transferred for auto handling */
      paths: null,

      /** Specifies whether the configurations from the paths overwrite the configuration contained in this object */
      pathsOverwriteCurrent: false
    },

    /**
     * Configuration of fortune
     *
     * Fortune.js is a non-native graph database abstraction layer for Node.js and web browsers.
     *
     * See http://fortune.js.org/api/#fortune-constructor
     */
    fortune: {

      /**
       * Adapter for fortune
       *
       * See http://fortune.js.org/plugins/
       */
      adapter: [

        // MongoDB adapter
        mongodbAdapter,

        // Configuration of MongoDB adapter (see https://github.com/fortunejs/fortune-mongodb#options)
        {
          url: 'mongodb://localhost:27017/yos'
        }
      ],

      /** Internal settings for fortune */
      settings: {

        /** Whether or not to enforce referential integrity. Default: `true` for server, `false` for browser */
        enforceLinks: true,

        /** Name of the application used for display purposes */
        name: 'Yos Server',

        /** Description of the application used for display purposes */
        description: 'media type "application/vnd.micro+json"'
      }
    },

    /** Configuration of yos-server */
    yosServer: {

      /**
       * Hostname under which the server runs
       * - '0.0.0.0' => accessible from outside
       * - '127.0.0.1' / 'localhost' => local-only interface
       * will be overwritten by process.env.HOSTNAME
       */
      hostname: '0.0.0.0',

      /** Name of the server */
      name: 'YosServer',

      /** Port on which the server is running - will be overwritten by process.env.PORT */
      port: 8080
    }
  };

  /**
   * Modules
   *
   * Modules can be integrated as classes, instances or within configurations
   */
  public modules: YosModulesConfig = {

    // /** Module to initialize the authentication handling*/
    // authenticationModule: YosAuthenticationModule, ** Replaced by graphQLGenieModule **

    /** Module to set the context in YosServer instance */
    contextModule: {

      /** Initial context */
      context: {},

      /** Initialize functions for context variables */
      initFunctions: {
        ipLookup: YosContextModule.initIpLookup
      },

      /** Module class */
      module: YosContextModule
    },

    /**
     * GraphQL Genie module
     *
     * See https://github.com/genie-team/graphql-genie
     */
    graphQLGenieModule: {

      /**
       * Generator options
       *
       * See https://github.com/genie-team/graphql-genie/blob/master/docs/GraphQLGenieAPI.md#constructor
       */
      generatorOptions: {

        /** GraphQL API will have a Query to get all of a type, with filters, that returns a Connection rather than simple array */
        generateConnections: true,

        /** GraphQL API will have a Mutation to create new data of each type */
        generateCreate: true,

        /** GraphQL API will have a Mutation to delete data of each type */
        generateDelete: true,

        /** GraphQL API will have a Query to get all of a type, with filters */
        generateGetAll: true,

        /** GraphQL API will have a singular queries using unique fields */
        generateGetOne: true,

        /** A Query exportData and a Mutation importData will be created */
        generateMigration: true,

        /** GraphQL API will have a Mutation to update data of each type */
        generateUpdate: true,

        /** GraphQL API will have a Mutation to upsert data of each type */
        generateUpsert: true
      },

      /** Module class*/
      module: YosGraphQLGenieModule,

      /**
       * Schema builder for advanced use cases
       *
       * See https://github.com/genie-team/graphql-genie/blob/master/docs/GraphQLGenieAPI.md#graphqlschemabuilder-api
       */
      schemaBuilder: undefined,

      /**
       * Enable subscriptions (see GraphQLModule)
       * - true => enable subscriptions
       * - false => disable subscriptions
       */
      subscriptions: true
    },

    /** GraphQL module */
    graphQLModule: {

      /**
       * Set own apollo server
       * (https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html)
       */
      apolloSever: undefined,

      /**
       * Configuration for new apollo server
       * (see https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html)
       */
      apolloConfig: {

        /**
         * Enable mocks
         * (see: https://www.apollographql.com/docs/apollo-server/v2/features/mocking.html)
         * - object => enable mocks via customize mocks
         * - true => enable auto mocks
         * - false => disable mocks
         */
        mocks: false,

        /** Introspection */
        introspection: true,

        /**
         * Enable playground
         * - true => enable playground on graphql url
         * - false => disable playground
         */
        playground: true
      },

      /** Dir path, file path or object (array) for core schemas */
      coreSchemas: path.join(__dirname, '../api'),

      /** Module class*/
      module: YosGraphQLModule,

      /** Must be loaded after the GraphQLGenieModule because it integrates its schema via hook */
      position: 10,

      /** Dir path, file path or object (array) for project schemas */
      schemas: null,

      /**
       * Enable subscriptions
       * - string => enable subscriptions on this url endpoint
       * - true => enable subscriptions on '/subscriptions'
       * - false => disable subscriptions
       */
      subscriptions: 'subscriptions',

      /** URL endpoint */
      url: 'graphql'
    },

    /** Module for global processes */
    processModule: YosProcessModule
  };

  /**
   * Services
   *
   * Services can be integrated as classes, instances or within configurations
   */
  public services: YosServicesConfig = {

    /** Service for authentication handling */
    authenticationService: YosAuthenticationService,

    /** Service for GraphQL api */
    graphQLService: {

      /** GraphQL service */
      service: YosGraphQLService,

      /**
       * Due to the dependency, the position must be larger than that of the subscriptionService.
       *
       * Alternatively, the GraphQLService can be organized so that the methods always access the
       * YosSubscriptionService via the current YosServer instance. This means that the YosSubscriptionService does not
       * have to be available during initialization. But this makes the handling within the GraphQLService more
       * complicated.
       */
      position: 10
    },

    /** Service for action and filter hooks */
    hooksService: YosHooksService,

    /** Service for subscription handling */
    subscriptionService: YosSubscriptionService
  };
}
