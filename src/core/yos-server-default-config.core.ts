import { YosServerConfig, YosServerCoreConfig, YosServerModuleConfig } from '..';

/**
 * Default yos-server configuration
 *
 * If changes are made, please also adapt the YosServerConfig interface accordingly.
 */
export class YosServerDefaultConfig implements YosServerConfig {

  // Core
  public core: YosServerCoreConfig = {

    // Configuration of automatic configuration handling
    configurations: {

      // If a configuration object is transferred, another path is transferred for auto handling
      path: null
    },

    // Configuration of modules
    modules: {

      // Full path of directory of additional modules in project
      directory: null,

      // Extension of file name
      fileNameExtension: 'module',

      // Extension of module name
      moduleNameExtension: 'Module'
    },

    // Configuration of yos-server
    yosServer: {

      // Hostname under which the server runs
      // '0.0.0.0' => accessible from outside
      // '127.0.0.1' / 'localhost' => local-only interface
      hostname: '0.0.0.0',

      // Port on which the server is running
      port: 3000
    }
  };

  // Modules
  public modules: { [module: string]: YosServerModuleConfig } = {

    // GraphQL Module
    graphQL: {
      module: {
        active: true,
        fileName: 'graphql',
        className: 'GraphQL'
      }
    }
  };
}
