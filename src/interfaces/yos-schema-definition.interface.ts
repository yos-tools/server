import { IResolvers, ITypeDefinitions } from 'graphql-tools';

/**
 * GraphQL schema definition of yos-server
 */
export interface YosSchemaDefinition<TContext = any> {

  /** Definitions of GraphQL types */
  typeDefs: ITypeDefinitions;

  /** Resolvers for queries, mutations and subscriptions */
  resolvers?: IResolvers<any, TContext> | Array<IResolvers<any, TContext>>;
}
