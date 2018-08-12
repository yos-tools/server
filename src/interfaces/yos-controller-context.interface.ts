import { Request, Response } from 'express';
import {
  YosAuthenticationModule,
  YosAuthenticationService,
  YosContext,
  YosContextModule, YosGraphQLGenieModule,
  YosGraphQLModule,
  YosGraphQLService,
  YosHooksService,
  YosModule,
  YosObject,
  YosProcessModule,
  YosServer,
  YosService,
  YosSubscriptionService
} from '..';

/**
 * Interface for controllers context
 */
export interface YosControllerContext extends YosContext {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /** Modules of yos-server instance (shortcut for yosServer.modules) */
  modules?: {

    /** Every (custom) module is allowed */
    [module: string]: YosModule;

    /** Module to initialize the authentication handling*/
    authenticationModule?: YosAuthenticationModule;

    /** Module to set the context in YosServer instance */
    contextModule?: YosContextModule;

    /** GraphQL Genie module */
    graphQLGenieModule?: YosGraphQLGenieModule;

    /** GraphQL module */
    graphQLModule?: YosGraphQLModule;

    /** Module for global processes */
    processModule?: YosProcessModule;
  };

  /** Params from request */
  params?: YosObject;

  /** Express request */
  req?: Request;

  /** Express response */
  res?: Response;

  /** Services of yos-server instance (shortcut for yosServer.services) */
  services?: {

    /** Every (custom) service is allowed */
    [service: string]: YosService;

    /** Service for authentication handling */
    authenticationService?: YosAuthenticationService;

    /** Service for GraphQL api */
    graphQLService?: YosGraphQLService;

    /** Service for action and filter hooks */
    hooksService?: YosHooksService;

    /** Service for subscription handling */
    subscriptionService?: YosSubscriptionService;
  };

  /** Current user */
  user?: any // @todo: User should be of type UserModel

  /** Yos-server instance */
  yosServer?: YosServer;
}
