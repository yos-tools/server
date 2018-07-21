import {
  YosAuthenticationService, YosGraphQLService, YosHooksService, YosService, YosServiceConfig,
  YosSubscriptionService
} from '..';


/**
 * Interface for services
 */
export interface YosServicesConfig {

  /** Additional services from the respective project */
  [service: string]: YosService | typeof YosService | YosServiceConfig;

  /** Service for authentication handling */
  authenticationService?: YosAuthenticationService | typeof YosAuthenticationService | YosServiceConfig;

  /** Service for action and filter hooks */
  hooksService?: YosHooksService | typeof YosHooksService | YosServiceConfig;

  /** Service for GraphQL api */
  graphQLService?: YosGraphQLService | typeof YosGraphQLService | YosServiceConfig;

  /** Service for subscription handling */
  subscriptionService?: YosSubscriptionService | typeof YosSubscriptionService | YosServiceConfig;
}
