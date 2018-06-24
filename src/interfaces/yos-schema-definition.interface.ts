import { IResolvers, ITypeDefinitions } from 'graphql-tools';

/**
 * GraphQL schema definition of yos-server
 */
export interface YosSchemaDefinition<TContext = any> {
  typeDefs: ITypeDefinitions;
  resolvers?: IResolvers<any, TContext> | Array<IResolvers<any, TContext>>;
}
