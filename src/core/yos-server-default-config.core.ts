import * as path from 'path';
import {
  YosAuthenticationModule,
  YosAuthenticationService,
  YosContextModule,
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

        /** Must be set in the project, otherwise an error is thrown */
        secretOrPrivateKey: 'REPLACE IN PROJECT!!!' // @todo: Set to null
      }
    },

    /** Configuration of automatic configuration handling */
    configurations: {

      /** If a configuration object is transferred, another path is transferred for auto handling */
      paths: null,

      /** Specifies whether the configurations from the paths overwrite the configuration contained in this object */
      pathsOverwriteCurrent: false
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

    /** Module to initialize the authentication handling*/
    authenticationModule: YosAuthenticationModule,

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

    /** GraphQL module */
    graphQLModule: {

      /** Set own apollo server
       * (https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html) */
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
