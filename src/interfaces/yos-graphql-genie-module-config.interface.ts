import { GenerateConfig, GraphQLSchemaBuilder } from 'graphql-genie';
import { YosExtends, YosGraphQLGenieModule, YosModuleConfig } from '..';

/**
 * Interface for GraphQL Genie module config
 */
export interface YosGraphQLGenieModuleConfig extends YosModuleConfig {

  /**
   * Generator options
   *
   * See https://github.com/genie-team/graphql-genie/blob/master/docs/GraphQLGenieAPI.md#constructor
   */
  generatorOptions?: GenerateConfig;

  /** Module class */
  module: YosExtends<YosGraphQLGenieModule>;

  /** Schema Builder */
  schemaBuilder?: GraphQLSchemaBuilder;

  /**
   * Enable subscriptions
   * - true => enable subscriptions (see GraphQLModule)
   * - false => disable subscriptions
   */
  subscriptions?: boolean;
}
