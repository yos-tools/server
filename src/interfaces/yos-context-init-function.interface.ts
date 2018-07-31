import { YosObject } from '..';

/**
 * Interface for context initialize function of context variables
 */
export interface YosContextInitFunction {

  /**
   * Context init function
   * @param context
   * @param env
   */
  (context?: YosObject, env?: { [key: string]: string }): any | Promise<any>;
}
