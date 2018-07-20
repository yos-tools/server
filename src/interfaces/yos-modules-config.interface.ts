import { YosGraphQLModule, YosGraphQLModuleConfig, YosModule, YosModuleConfig, YosProcessModule } from '..';

/**
 * Interface for configrution of modules
 */
export interface YosModulesConfig {

  /** Additional modules from the respective project */
  [module: string]: YosModule | typeof YosModule | YosModuleConfig

  /** Module for integration of GraphQL handling */
  yosGraphQL?: YosGraphQLModule | typeof YosGraphQLModule | YosGraphQLModuleConfig

  /** Module for global processes */
  processModule?: YosProcessModule | typeof YosProcessModule | YosModuleConfig
}
