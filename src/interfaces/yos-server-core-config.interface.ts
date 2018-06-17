/**
 * Interface for yos-server core configuration
 */
import { YosServerModuleLoadConfig } from './yos-server-module-load-config.interface';

export interface YosServerCoreConfig {

  // Configuration of automatic configuration handling
  configurations?: {

    // If a configuration object is transferred, another path is transferred for auto handling
    path?: string | string[]
  },

  // Configuration of project modules
  coreModules: YosServerModuleLoadConfig,

  // Configuration of modules
  modules: YosServerModuleLoadConfig,

  // Configuration of yos-server
  yosServer?: {

    // Hostname under which the server runs
    // '0.0.0.0' => accessible from outside
    // '127.0.0.1' / 'localhost' => local-only interface
    hostname?: string,

    // Port on which the server is running
    port?: number
  }
}
