import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { IResolvers, ITypeDefinitions } from 'graphql-tools';

/**
 * GraphQL schema definition of yos-server
 */
export interface YosSchemaDefinition<TContext = any> {

  /**
   * Definitions of GraphQL types for automatic processing by GraphQL Genie
   * (https://www.apollographql.com/docs/graphql-tools/generate-schema.html)
   */
  autoTypeDefs?: ITypeDefinitions;

  /**
   * Definitions of GraphQL types
   * (https://www.apollographql.com/docs/graphql-tools/generate-schema.html)
   */
  typeDefs?: ITypeDefinitions;

  /**
   * Resolvers for queries, mutations and subscriptions
   * (https://www.apollographql.com/docs/graphql-tools/resolvers.html)
   */
  resolvers?: IResolvers<any, TContext> | Array<IResolvers<any, TContext>>;

  /**
   * Schema directives of type SchemaDirectiveVisitor
   * (https://www.apollographql.com/docs/graphql-tools/schema-directives.html)
   */
  schemaDirectives?: { [name: string]: typeof SchemaDirectiveVisitor }
}
