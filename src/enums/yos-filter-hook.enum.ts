/**
 * Available filter hooks
 */
export enum YosFilterHook {

  /**
   * Filter hook for context of GraphQL for queries, mutations and subscriptions (see YosGraphQLModule.initApolloServer)
   *
   * Used by:
   * - YosAuthentication.setFilters to set user
   */
  GraphQLContext = 'GRAPHQL_CONTEXT',

  /**
   * Filter hook for schema of GraphQL (see YosGraphQLModule.initGraphQLSchemas)
   */
  GraphQLDefinition = 'GRAPHQL_DEFINITION',

  /**
   * Filter hook for schema of GraphQL (see YosGraphQLModule.initGraphQLSchemas)
   *
   * Used by:
   * - YosGraphQLGenieModule.integrateGenieSchema to integrate GraphQL Genie schema
   */
  GraphQLSchema = 'GRAPHQL_SCHEMA',

  /**
   * Filter hook of incoming request context before processing by resolver (see YosResolver.resolve)
   *
   * Used by:
   * - YosAuthentication.setFilters to set user
   */
  IncomingRequestContext = 'INCOMING_REQUEST_CONTEXT',

  /** Filter hook of incoming request context before processing by resolver (see YosResolver.resolve) */
  OutgoingResponse = 'OUTGOING_RESPONSE',
}
