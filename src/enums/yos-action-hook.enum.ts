/**
 * Available action hooks
 */
export enum YosActionHook {

  /** Action hook after the server has been started (see YosServer.serve) */
  AfterServerStart = "AFTER_SERVER_START",

  /** Action hook before starting the server (see YosServer.serve) */
  BeforeServerStart = "BEFORE_SERVER_START",
}
