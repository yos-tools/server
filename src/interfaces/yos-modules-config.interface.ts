import { YosGraphQLModule, YosGraphqlModuleConfig, YosModule, YosModuleConfig, YosProcessModule } from '..';

/**
 * Interface for configrution of modules
 */
export interface YosModulesConfig {
  [module: string]: YosModule | typeof YosModule | YosModuleConfig

  yosGraphQL?: YosGraphQLModule | typeof YosGraphQLModule | YosGraphqlModuleConfig
  processModule?: YosProcessModule | typeof YosProcessModule | YosModuleConfig
}
