import * as _ from 'lodash';
import { YosAuthenticationService, YosControllerContext, YosFilterHook, YosHelper, YosModule, YosServer } from '..';


/**
 * Authentication module
 */
export class YosAuthenticationModule extends YosModule {

  /** Authentication service */
  protected _authenticationService: YosAuthenticationService;


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

    // Set authentication service
    authenticationModel._authenticationService = <YosAuthenticationService> yosServer.services.authenticationService;
    if (!authenticationModel._authenticationService) {
      throw Error('Missing instance of AuthenticationService in ' + YosHelper.getClassName(this));
    }

    // Check hooks service
    const hooksService = yosServer.services.hooksService;
    if (!hooksService) {
      throw Error('Missing instance of HookService in ' + YosHelper.getClassName(this));
    }

    // Set user in request context via filter
    hooksService.addFilter(YosFilterHook.IncomingRequestContext, {
      id: 'YosAuthenticationModule.setUserViaToken',
      func: authenticationModel.setUserViaToken
    });

    // Return authentication model instance
    return authenticationModel;
  }


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Set current user in context via token data
   * @param {YosControllerContext} context
   * @returns {Promise<YosControllerContext>}
   */
  public async setUserViaToken(context: YosControllerContext): Promise<YosControllerContext> {

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
      // @todo: Get users from the database
      context.user = data.user;
    }

    // Return context
    return context;
  }

}
