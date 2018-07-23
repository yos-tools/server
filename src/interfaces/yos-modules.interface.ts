import { YosGraphQLModule, YosModule, YosProcessModule } from '..';

/**
 * Interface for modules
 */
export interface YosModules {

  /** Additional modules from the respective project */
  [module: string]: YosModule

  /** Module for integration of GraphQL handling */
  yosGraphQL?: YosGraphQLModule

  /** Module for global processes */
  processModule?: YosProcessModule
}
