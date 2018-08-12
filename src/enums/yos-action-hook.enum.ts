/**
 * Available action hooks
 */
export enum YosActionHook {

  /**
   * Action hook after the server has been started (see YosServer.serve)
   *
   * Used by:
   * - YosGraphQLModule.systemLog to show start of module and subscriptions
   */
  AfterServerStart = 'AFTER_SERVER_START',

  /** Action hook before starting the server (see YosServer.serve) */
  BeforeServerStart = 'BEFORE_SERVER_START',
}
