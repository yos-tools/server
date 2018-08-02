import {
  YosAuthenticationModule,
  YosContextModule,
  YosContextModuleConfig,
  YosGraphQLModule,
  YosGraphQLModuleConfig,
  YosModule,
  YosModuleConfig,
  YosProcessModule,
  YosExtends
} from '..';

/**
 * Interface for configrution of modules
 */
export interface YosModulesConfig {

  /** Additional modules from the respective project */
  [module: string]: YosModule | YosExtends<YosModule> | YosModuleConfig;

  /** Module to initialize the authentication handling*/
  authenticationModule?: YosAuthenticationModule | YosExtends<YosAuthenticationModule> | YosModuleConfig;

  /** Module to set the context in YosServer instance */
  contextModule?: YosContextModule | YosExtends<YosContextModule> | YosContextModuleConfig;

  /** Module for integration of GraphQL handling */
  graphQLModule?: YosGraphQLModule | YosExtends<YosGraphQLModule> | YosGraphQLModuleConfig;

  /** Module for global processes */
  processModule?: YosProcessModule | YosExtends<YosProcessModule> | YosModuleConfig;
}
