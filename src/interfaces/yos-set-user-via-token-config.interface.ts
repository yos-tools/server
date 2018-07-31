/**
 * Interface for the configuration of setUserViaToken Funktion in YosAuthenticationModule
 */
export interface YosSetUserViaTokenConfig {

  /** Specifies whether a user that may already have been stored should be overwritten */
  overwrite: boolean;
}
