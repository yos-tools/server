/**
 * Interface for yos-server configuration
 *
 * The default values are set in the class YosServerDefaultConfig
 */
export interface YosServerConfig {

  // Core configuration
  core? : {

    // Configuration of yos-server
    yosServer?: {

      // Hostname under which the server runs
      // '0.0.0.0' => accessible from outside
      // '127.0.0.1' / 'localhost' => local-only interface
      hostname?: string,

      // Port on which the server is running
      port?: number
    },

    // Configuration of automatic configuration handling
    configuration?: {

      // If a configuration object is transferred, another path is transferred for auto handling
      path?: string | string[]
    }
  }
}
