import { YosContextModuleConfig, YosHelper, YosModule, YosServer } from '..';

/**
 * Context module
 *
 * This module is used to initialize variables (once) on server startup and make them available globally in the context
 * property in the current yosServer instance.
 *
 * If only the ControllerContext is to be extended, this is possible via the FilterHook IncomingRequestContext, which
 * can manipulate the context in the resolve function of the YosResolver.
 */
export class YosContextModule extends YosModule {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /** Context variables **/
  public context: { [key: string]: any } = {};

  /** Init functions to prepare context variables **/
  public initFunctions:
    { [key: string]: (context?: { [key: string]: any }, env?: { [key: string]: string }) => any | Promise<any> } = {};


  // ===================================================================================================================
  // Init
  // ===================================================================================================================

  /**
   * Init instance of process environment service
   * @param {YosServer} yosServer
   * @param {YosModuleConfig} config
   * @returns {YosContextModule}
   */
  public static async init(yosServer: YosServer, config?: YosContextModuleConfig): Promise<YosContextModule> {

    // Create new service
    const contextModule = new YosContextModule(yosServer, config);

    // Integrate init functions from config
    YosHelper.specialMerge(contextModule.initFunctions, config.initFunctions);

    // Process init functions and save results in context
    for (const [key, func] of Object.entries(contextModule.initFunctions)) {
      contextModule.context[key] = await (<(...any: any[]) => any>func)(yosServer.context, process.env);
    }

    // Set context in yosServer
    YosHelper.specialMerge(yosServer.context, contextModule.context);

    // Return
    return contextModule;
  }


  // ===================================================================================================================
  // Methods (init / process functions)
  // ===================================================================================================================

  /**
   * Init ipLookup
   *
   * If IP_LOOKUP_KEY is set in process.env a request to [ipstack](https://ipstack.com) will send and the
   * result will be returned
   *
   * @param context
   * @param env
   */
  public static async initIpLookup(context: { [key: string]: any }, env: { [key: string]: string }): Promise<any> {
    let ipLookup: any;
    if (env['IP_LOOKUP_KEY']) {
      try {
        ipLookup = JSON.parse(await YosHelper.request.get('http://api.ipstack.com/check?access_key=' + env.IP_LOOKUP_KEY));
      } catch (err) {
        console.log(err);
      }
    }
    return ipLookup;
  }
}
