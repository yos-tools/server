import { YosHooksService, YosService, YosServiceConfig } from '..';

/**
 * Interface for services
 */
export interface YosServicesConfig {
  [service: string]: YosService | typeof YosService | YosServiceConfig

  hooksService?: YosHooksService | typeof YosHooksService | YosServiceConfig
}
