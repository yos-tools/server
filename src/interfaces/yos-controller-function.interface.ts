import { YosControllerContext } from '..';

/**
 * Interface for the controller functions
 */
export interface YosControllerFunction {

  /** Function with context as optional parameter */
  (context?: YosControllerContext, ...args: any[]): any;
}
