import { GraphQLResolveInfo } from 'graphql';

/**
 *  Context of GraphQL Request
 *  See https://www.apollographql.com/docs/graphql-tools/resolvers.html#Resolver-function-signature
 */
export class YosGraphQLContext {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /** An object with the arguments passed into the field in the query. For example, if the field was called with
   * author(name: "Ada"), the args object would be: { "name": "Ada" }. */
  args?: {[arg: string]: any};

  /** This is an object shared by all resolvers in a particular query, and is used to contain per-request state,
   * including authentication information, dataloader instances, and anything else that should be taken into account
   * when resolving the query. */
  context?: any;

  /** This argument should only be used in advanced cases, but it contains information about the execution state of the
   * query, including the field name, path to the field from the root, and more. */
  info?: GraphQLResolveInfo;

  /** The object that contains the result returned from the resolver on the parent field, or, in the case of a top-level
   * Query field, the rootValue passed from the server configuration. This argument enables the nested nature of
   * GraphQL queries. */
  parent?: any;
}
