import { YosAuthenticationService, YosGraphQLService, YosHooksService, YosService, YosSubscriptionService } from '..';

/**
 * Services interface
 */
export interface YosServices {

  /** Additional services from the respective project */
  [service: string]: YosService;

  /** Service for authentication handling */
  authenticationService?: YosAuthenticationService;

  /** Service for action and filter hooks */
  hooksService?: YosHooksService;

  /** Service for GraphQL api */
  graphQLService?: YosGraphQLService;

  /** Service for subscription handling */
  subscriptionService?: YosSubscriptionService;
}
