import { YosServerCoreConfig, YosServerModuleConfig } from '..';

/**
 * Interface for yos-server configuration
 *
 * The default values are set in the class YosServerDefaultConfig
 */
export interface YosServerConfig {

  // Core configuration
  core?: YosServerCoreConfig,

  modules?: {

    // Modules configuration
    [module: string]: YosServerModuleConfig
  }
}
