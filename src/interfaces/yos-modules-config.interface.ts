import { YosGraphQLModule, YosGraphQLModuleConfig, YosModule, YosModuleConfig, YosProcessModule } from '..';

/**
 * Interface for configrution of modules
 */
export interface YosModulesConfig {
  [module: string]: YosModule | typeof YosModule | YosModuleConfig

  yosGraphQL?: YosGraphQLModule | typeof YosGraphQLModule | YosGraphQLModuleConfig
  processModule?: YosProcessModule | typeof YosProcessModule | YosModuleConfig
}
