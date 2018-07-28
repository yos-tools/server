import {
  YosAuthenticationModule, YosContextModule, YosContextModuleConfig,
  YosGraphQLModule,
  YosGraphQLModuleConfig,
  YosModule,
  YosModuleConfig,
  YosProcessModule
} from '..';

/**
 * Interface for configrution of modules
 */
export interface YosModulesConfig {

  /** Additional modules from the respective project */
  [module: string]: YosModule | typeof YosModule | YosModuleConfig;

  /** Module to initialize the authentication handling*/
  authenticationModule?: YosAuthenticationModule | typeof YosAuthenticationModule | YosModuleConfig;

  /** Module to set the context in YosServer instance */
  contextModule?: YosContextModule | typeof YosContextModule | YosContextModuleConfig;

  /** Module for integration of GraphQL handling */
  graphQLModule?: YosGraphQLModule | typeof YosGraphQLModule | YosGraphQLModuleConfig;

  /** Module for global processes */
  processModule?: YosProcessModule | typeof YosProcessModule | YosModuleConfig;
}
