import { Config } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { YosGraphQLModule, YosGraphQLSchemasConfigType, YosModuleConfig } from '..';

/**
 * Interface for GraphQL module config
 */
export interface YosGraphQLModuleConfig extends YosModuleConfig {

  /** Set own apollo server
   * (https:/**www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html) */
  apolloSever?: ApolloServer,

  /** Configuration for new apollo server
   * (see https:/**www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html) */
  apolloConfig?: Config,

  /** Dir path, file path or object (array) for core schemas */
  coreSchemas?: YosGraphQLSchemasConfigType,

  /** Module config */
  module: typeof YosGraphQLModule,

  /** Enable playground
   * true => enable playground on GraphQL url
   * false => disable playground */
  playground?: boolean,

  /** Dir path, file path or object (array) for project schemas */
  schemas?: YosGraphQLSchemasConfigType,

  /** Enable subscriptions
   * string => enable subscriptions on this url endpoint
   * true => enable subscriptions on '/subscriptions'
   * false => disable subscriptions */
  subscriptions?: string | boolean,

  /** URL endpoint */
  url?: string
}
