import * as _ from 'lodash';
import { YosControllerContext, YosControllerFunction, YosFilterHook, YosGraphQLContext, YosHelper } from '..';

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
    if (_.has(context, 'services.hooksService')) {
      context = await context.services.hooksService.performFilters(YosFilterHook.IncomingRequestContext, context);
    }

    // Process request via controllers function
    let response = await controllerFunction(context);

    // Filter hook: outgoing response
    if (_.has(context, 'services.hooksService')) {
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
  public static graphQL(controllerFunction: YosControllerFunction, context?: YosGraphQLContext | any[]): Promise<any> {
    return YosResolver.resolve(controllerFunction, YosResolver.convertGraphQLContext(context));
  }

  /**
   * Convert GraphQL context to controllers context
   * @param {YosGraphQLContext} graphQLContext
   * @param {YosControllerContext} controllerContext
   * @returns {YosControllerContext}
   */
  public static convertGraphQLContext(graphQLContext: YosGraphQLContext, controllerContext: YosControllerContext | any[] = {}): YosControllerContext {

    if (Array.isArray(controllerContext)) {
      controllerContext = {
        parent: controllerContext[0],
        args: controllerContext[1],
        context: controllerContext[2],
        info: controllerContext[3]
      };
    }

    // Check GraphQL context
    if (graphQLContext) {

      // Standard context of YosCont
      controllerContext.params = graphQLContext.args;
      if (graphQLContext.context) {
        controllerContext.req = graphQLContext.context.req;
        controllerContext.res = graphQLContext.context.res;
        controllerContext.yosServer = graphQLContext.context.yosServer;
        if (graphQLContext.context.yosServer) {
          controllerContext.modules = graphQLContext.context.yosServer.modules;
          controllerContext.services = graphQLContext.context.yosServer.services;
        }
      }

      // Additional context
      controllerContext.graphQL = graphQLContext;

      // Move yosServer context up
      controllerContext = YosHelper.specialMerge({}, controllerContext.yosServer.context, controllerContext);
    }

    return controllerContext;
  }

}
