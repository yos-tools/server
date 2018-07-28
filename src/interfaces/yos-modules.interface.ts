import { YosAuthenticationModule, YosContextModule, YosGraphQLModule, YosModule, YosProcessModule } from '..';

/**
 * Interface for modules
 */
export interface YosModules {

  /** Additional modules from the respective project */
  [module: string]: YosModule;

  /** Module to initialize the authentication handling*/
  authenticationModule?: YosAuthenticationModule;

  /** Module to set the context in YosServer instance */
  contextModule?: YosContextModule;

  /** Module for integration of GraphQL handling */
  graphQLModule?: YosGraphQLModule;

  /** Module for global processes */
  processModule?: YosProcessModule;
}
