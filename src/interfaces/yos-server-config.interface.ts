import { YosModuleConfig, YosModulesConfig, YosServerCoreConfig, YosServicesConfig } from '..';

/**
 * Interface for yos-server configuration
 *
 * The default values are set in the class YosServerDefaultConfig
 */
export interface YosServerConfig {

  // Core configuration
  core?: YosServerCoreConfig,

  // Core modules configuration
  coreModules?: YosModuleConfig[],

  // Environment
  environment?: string,

  // Modules configuration
  modules?: YosModulesConfig,

  // YosServicesConfig configuration
  services?: YosServicesConfig
}
