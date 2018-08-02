import {
  YosAuthenticationService,
  YosGraphQLService,
  YosHooksService,
  YosService,
  YosServiceConfig,
  YosSubscriptionService,
  YosType
} from '..';


/**
 * Interface for configuration of services
 */
export interface YosServicesConfig {

  /** Additional services from the respective project */
  [service: string]: YosService | YosType<YosService> | YosServiceConfig;

  /** Service for authentication handling */
  authenticationService?: YosAuthenticationService | YosType<YosAuthenticationService> | YosServiceConfig;

  /** Service for GraphQL api */
  graphQLService?: YosGraphQLService | YosType<YosGraphQLService> | YosServiceConfig;

  /** Service for action and filter hooks */
  hooksService?: YosHooksService | YosType<YosHooksService> | YosServiceConfig;

  /** Service for subscription handling */
  subscriptionService?: YosSubscriptionService | YosType<YosSubscriptionService> | YosServiceConfig;
}
