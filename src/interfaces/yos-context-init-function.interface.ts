/**
 * Interface for context initialize function of context variables
 */
export interface YosContextInitFunction {

  /**
   * Context init function
   * @param context
   * @param env
   */
  (context?: { [key: string]: any }, env?: { [key: string]: string }): any | Promise<any>;
}
