import { YosContextInitFunction, YosContextModule, YosModuleConfig, YosObject, YosType } from '..';

/**
 * Configuration of context module
 */
export interface YosContextModuleConfig extends YosModuleConfig {

  /** Initial context */
  context?: YosObject;

  /** Initialize functions for context variables */
  initFunctions?: {

    /** Every (custom) property is allowed */
    [prop: string]: YosContextInitFunction;

    /** Init function for ipLookup context variable */
    ipLookup?: YosContextInitFunction;
  },

  /** Module class */
  module: YosType<YosContextModule>
}
