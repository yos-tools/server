import { YosHooksService, YosService, YosServiceConfig } from '..';

/**
 * Interface for services
 */
export interface YosServicesConfig {

  /** Additional services from the respective project */
  [service: string]: YosService | typeof YosService | YosServiceConfig

  /** Service for action and filter hooks */
  hooksService?: YosHooksService | typeof YosHooksService | YosServiceConfig
}
