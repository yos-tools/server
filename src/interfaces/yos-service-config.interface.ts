import { YosService } from '..';

/**
 * Interface for configuration of yos-server service
 */
export interface YosServiceConfig {

  // Individual properties of the service
  [prop: string]: any,

  // Information about the service
  service: typeof YosService

  // Integration position of the service
  // Services with a lower integration position are included first (asc)
  // If no priority is specified, the integration position is 0 and the service is considered one of the first
  position?: number
}
