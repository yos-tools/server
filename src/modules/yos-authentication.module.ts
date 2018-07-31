import * as _ from 'lodash';
import {
  YosAuthenticationService,
  YosControllerContext,
  YosFilterHook,
  YosHelper,
  YosHooksService,
  YosModule,
  YosServer,
  YosSetUserViaTokenConfig
} from '..';

/**
 * Authentication module
 */
export class YosAuthenticationModule extends YosModule {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /** Authentication service */
  protected _authenticationService: YosAuthenticationService;

  /** Hook service */
  protected _hooksService: YosHooksService;


  // ===================================================================================================================
  // Init
  // ===================================================================================================================

  /**
   * Init
   * @param {YosServer} yosServer
   * @returns {Promise<YosAuthenticationModule>}
   */
  public static async init(yosServer: YosServer): Promise<YosAuthenticationModule> {

    // New authentication model
    const authenticationModel = new YosAuthenticationModule(yosServer);

    // Set services for internal use
    authenticationModel.setServices(yosServer);

    // Set user in contexts via filters
    authenticationModel.setFilters();

    // Return authentication model instance
    return authenticationModel;
  }


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Set services
   * @param yosServer
   */
  protected setServices(yosServer: YosServer) {

    // Set authentication service
    this._authenticationService = <YosAuthenticationService> yosServer.services.authenticationService;
    if (!this._authenticationService) {
      throw Error('Missing instance of AuthenticationService in ' + YosHelper.getClassName(this));
    }

    // Check hooks service
    this._hooksService = yosServer.services.hooksService;
    if (!this._hooksService) {
      throw Error('Missing instance of HookService in ' + YosHelper.getClassName(this));
    }
  }

  /**
   * Set filters
   */
  protected setFilters() {

    // Set user in request context via filter
    this._hooksService.addFilter(YosFilterHook.IncomingRequestContext, {
      id: 'YosAuthenticationModule.setUserViaToken',
      func: this.setUserViaToken,
      config: {overwrite: false}
    });

    // Set user in GraphQL context via filter
    this._hooksService.addFilter(YosFilterHook.GraphQLContext, {
      id: 'YosAuthenticationModule.setUserViaToken',
      func: this.setUserViaToken
    });
  }

  /**
   * Set current user in context via token data
   * @param {YosControllerContext} context
   * @param config - Configuration
   * @returns {Promise<YosControllerContext>}
   */
  public async setUserViaToken(
    context: YosControllerContext,
    config: YosSetUserViaTokenConfig = {overwrite: true}
  ): Promise<YosControllerContext> {

    // Check if the user has already been set and should not be overwritten
    if (_.get(context, 'user') && !_.get(config, 'overwrite')) {
      return context;
    }

    // Authorization field in header
    const authorizationField = _.get(
      context,
      'yosServer.config.core.authorization.authorizationField',
      'Authorization'
    );

    // Process token
    let token: string = <string> context.req.headers[authorizationField];
    if (token && token.startsWith('JWT')) {
      token = token.replace('JWT ', '');
      const data = this._authenticationService.getTokenData(token);
      // @ToDo: Get users from the database
      context.user = data.user;
    }

    // Return context
    return context;
  }
}
