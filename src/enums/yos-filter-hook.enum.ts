/**
 * Available filter hooks
 */
export enum YosFilterHook {

  /** Filter hook of incoming request context before processing by resolver (see YosResolver.resolve) */
  IncomingRequestContext = "INCOMING_REQUEST_CONTEXT",

  /** Filter hook of incoming request context before processing by resolver (see YosResolver.resolve) */
  OutgoingResponse = "OUTGOING_RESPONSE",
}
