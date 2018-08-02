import {
  YosAuthenticationService,
  YosGraphQLService,
  YosHooksService,
  YosService,
  YosServiceConfig,
  YosSubscriptionService,
  YosExtends
} from '..';


/**
 * Interface for configuration of services
 */
export interface YosServicesConfig {

  /** Additional services from the respective project */
  [service: string]: YosService | YosExtends<YosService> | YosServiceConfig;

  /** Service for authentication handling */
  authenticationService?: YosAuthenticationService | YosExtends<YosAuthenticationService> | YosServiceConfig;

  /** Service for GraphQL api */
  graphQLService?: YosGraphQLService | YosExtends<YosGraphQLService> | YosServiceConfig;

  /** Service for action and filter hooks */
  hooksService?: YosHooksService | YosExtends<YosHooksService> | YosServiceConfig;

  /** Service for subscription handling */
  subscriptionService?: YosSubscriptionService | YosExtends<YosSubscriptionService> | YosServiceConfig;
}
