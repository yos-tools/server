import { YosContextInitFunction, YosContextModule, YosModuleConfig } from '..';

/**
 * Configuration of context module
 */
export interface YosContextModuleConfig extends YosModuleConfig {

  /** Initialize functions for context variables */
  initFunctions?: {

    /** Every (custom) property is allowed */
    [prop: string]: YosContextInitFunction;

    /** Init function for ipLookup context variable */
    ipLookup?: YosContextInitFunction;
  },

  /** Module class */
  module: typeof YosContextModule
}
