import {
  YosAuthenticationModule,
  YosContextModule,
  YosContextModuleConfig,
  YosGraphQLModule,
  YosGraphQLModuleConfig,
  YosModule,
  YosModuleConfig,
  YosProcessModule,
  YosType
} from '..';

/**
 * Interface for configrution of modules
 */
export interface YosModulesConfig {

  /** Additional modules from the respective project */
  [module: string]: YosModule | YosType<YosModule> | YosModuleConfig;

  /** Module to initialize the authentication handling*/
  authenticationModule?: YosAuthenticationModule | YosType<YosAuthenticationModule> | YosModuleConfig;

  /** Module to set the context in YosServer instance */
  contextModule?: YosContextModule | YosType<YosContextModule> | YosContextModuleConfig;

  /** Module for integration of GraphQL handling */
  graphQLModule?: YosGraphQLModule | YosType<YosGraphQLModule> | YosGraphQLModuleConfig;

  /** Module for global processes */
  processModule?: YosProcessModule | YosType<YosProcessModule> | YosModuleConfig;
}
