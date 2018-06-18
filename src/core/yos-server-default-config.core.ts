import * as path from 'path';
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
      paths: null,

      // Specifies whether the configurations from the paths overwrite the configuration contained in this object
      pathsOverwriteCurrent: false
    },

    // Configuration of core modules
    coreModules: {

      // Full path of directory of additional modules in project
      directory: path.join(__dirname, '../modules'),

      // Extension of file name
      fileNameExtension: 'module',

      // Extension of module name
      moduleNameExtension: 'Module'
    },

    // Configuration of project modules
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

      // Name of the server
      name: 'YosServer',

      // Port on which the server is running
      port: 3000
    }
  };

  // Core modules
  public coreModules: YosServerModuleConfig[] = [
    {
      // Module config
      module: {
        active: true,
        fileName: 'graphql',
        className: 'GraphQL'
      },

      // Enable playground
      // true => enable playground on graphql url
      // false => disable playground
      playground: true,

      // Enable subscriptions
      // string => enable subscriptions on this url endpoint
      // true => enable subscriptions on '/subscriptions'
      // false => disable subscriptions
      subscriptions: 'subscriptions',

      // URL endpoint
      url: 'graphql'
    }
  ];

  // Project modules
  public modules:  YosServerModuleConfig[] = []
}
