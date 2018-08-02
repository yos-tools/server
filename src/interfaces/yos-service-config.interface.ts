import { YosService, YosExtends } from '..';

/**
 * Interface for configuration of service
 */
export interface YosServiceConfig {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /** Information about the service */
  service: YosExtends<YosService>;

  /** Integration position of the service
   * Services with a lower integration position are included first (asc)
   * If no priority is specified, the integration position is 0 and the service is considered one of the first */
  position?: number;
}
