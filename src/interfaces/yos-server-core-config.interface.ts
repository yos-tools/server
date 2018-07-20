/**
 * Interface for yos-server core configuration
 */
import { YosJwtConfig } from './yos-jwt-config.interface';

export interface YosServerCoreConfig {

  /** Configuration for the authorization handling */
  authorization: {

    /** Name of the authorization field of the http header
     * The standard "Authorization" leads to an error when using directory protection in an upstream server
     * (e.g. NGINX or Apache) */
    authorizationField?: string,

    /** JWT configuration
     * See https:/**github.com/auth0/node-jsonwebtoken */
    jwt?: YosJwtConfig
  }

  /** Configuration of automatic configuration handling */
  configurations?: {

    /** If a configuration object is transferred, another path is transferred for auto handling */
    paths?: string | string[],

    /** Specifies whether the configurations from the paths overwrite the configuration contained in this object. */
    pathsOverwriteCurrent?: boolean
  },

  /** Configuration of yos-server */
  yosServer?: {

    /** Hostname under which the server runs
     * '0.0.0.0' => accessible from outside
     * '127.0.0.1' / 'localhost' => local-only interface */
    hostname?: string,

    /** Name of the server */
    name?: string,

    /** Port on which the server is running */
    port?: number
  }
}
