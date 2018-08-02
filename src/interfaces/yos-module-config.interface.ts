import { YosModule, YosExtends } from '..';

/**
 * Interface for configuration of yos-server modules
 */
export interface YosModuleConfig {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /** Module class */
  module: YosExtends<YosModule>;

  /** Integration position of the module
   * Modules with a lower integration position are included first (asc)
   * If no priority is specified, the integration position is 0 and the module is considered one of the first */
  position?: number;
}
