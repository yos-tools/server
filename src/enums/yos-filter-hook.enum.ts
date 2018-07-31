/**
 * Available filter hooks
 */
export enum YosFilterHook {

  /** Filter hook for context of graphql for queries, mutations and subscriptions (see YosGraphQL Service) */
  GraphQLContext = "GRAPHQL_CONTEXT",

  /** Filter hook of incoming request context before processing by resolver (see YosResolver.resolve) */
  IncomingRequestContext = "INCOMING_REQUEST_CONTEXT",

  /** Filter hook of incoming request context before processing by resolver (see YosResolver.resolve) */
  OutgoingResponse = "OUTGOING_RESPONSE",
}
