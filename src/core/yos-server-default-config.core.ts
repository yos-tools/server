import { YosServerConfig } from '../interfaces/yos-server-config.interface';

/**
 * Default yos-server configuration
 *
 * If changes are made, please also adapt the YosServerConfig interface accordingly.
 */
export class YosServerDefaultConfig implements YosServerConfig {

  // Configuration of core
  public core: any = {

    // Configuration of yos-server
    yosServer: {

      // Hostname under which the server runs
      // '0.0.0.0' => accessible from outside
      // '127.0.0.1' / 'localhost' => local-only interface
      hostname: '0.0.0.0',

      // Port on which the server is running
      port: 3000
    },

    // Configuration of automatic configuration handling
    configuration: {

      // If a configuration object is transferred, another path is transferred for auto handling
      path: null
    }
  }
}
