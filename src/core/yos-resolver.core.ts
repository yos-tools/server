import { YosControllerContext, YosControllerFunction, YosFilterHook, YosGraphQLContext } from '..';
import * as _ from 'lodash';

/**
 * Resolver
 */
export class YosResolver {

  /**
   * Resolve all requests
   * @param {YosControllerFunction} controllerFunction
   * @param {YosControllerContext} context
   * @returns {Promise<any>}
   */
  protected static async resolve(controllerFunction: YosControllerFunction, context: YosControllerContext): Promise<any> {

    // Filter hook: incoming request
    if (_.has(context,'services.hooksService')) {
      context = await context.services.hooksService.performFilters(YosFilterHook.IncomingRequestContext, context);
    }

    // Process request via controller function
    let response = await controllerFunction(context);

    // Filter hook: outgoing response
    if (_.has(context,'services.hooksService')) {
      response = await context.services.hooksService.performFilters(YosFilterHook.OutgoingResponse, response);
    }

    // Return response
    return response;
  }

  /**
   * Resolve GraphQL requests
   * @param {YosControllerFunction} controllerFunction
   * @param {YosGraphQLContext} context
   * @returns {Promise<any>}
   */
  public static async graphQL(controllerFunction: YosControllerFunction, context?: YosGraphQLContext): Promise<any> {

    // Init controller context
    let controllerContext: YosControllerContext = {};

    // Map GraphQL context
    if (context) {

      // Standard context of YosCont
      controllerContext.params = context.args;
      if (context.context) {
        controllerContext.req = context.context.req;
        controllerContext.res = context.context.res;
        controllerContext.yosServer = context.context.yosServer;
        if (context.context.yosServer) {
          controllerContext.modules = context.context.yosServer.modules;
          controllerContext.services = context.context.yosServer.services;
        }
      }

      // Additional context
      controllerContext.graphQL = context;
    }

    // Resolve
    return YosResolver.resolve(controllerFunction, controllerContext);
  }

}
