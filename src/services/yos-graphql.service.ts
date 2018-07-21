import { PubSub, ResolverFn, withFilter } from 'apollo-server';
import * as _ from 'lodash';
import { YosControllerFunction, YosGraphQLContext, YosResolver, YosServer, YosService, YosServiceConfig } from '..';

/**
 * Service for GraphQL handling
 */
export class YosGraphQLService extends YosService {

  protected _pubsub: PubSub;

  // ===================================================================================================================
  // Init
  // ===================================================================================================================

  /**
   * Init instance of GraphQL service
   * @param {YosServer} yosServer
   * @param {YosServiceConfig} config
   * @returns {YosGraphQLService}
   */
  public static init(yosServer: YosServer, config?: YosServiceConfig): YosGraphQLService {

    // New instance
    const yosGraphQLService = new YosGraphQLService(yosServer, config);

    // Init PubSub
    yosGraphQLService._pubsub = new PubSub();

    // Return instance
    return yosGraphQLService;
  }


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Subscription with optional filter handling
   * @param {string | string[]} triggers
   * @param {YosGraphQLContext} filterArgs
   * @param {YosControllerFunction} filterFn
   * @returns {AsyncIterator<T> | ResolverFn}
   */
  public subscription<T>(triggers: string | string[], filterArgs?: YosGraphQLContext, filterFn?: YosControllerFunction): AsyncIterator<T> | ResolverFn {

    if (filterArgs) {
      return withFilter(
        () => this._pubsub.asyncIterator(triggers),
        (parent, args, context, info) => YosGraphQLService.subscriptionFilter({parent, args, context, info}, filterFn)
      );
    }

    return this._pubsub.asyncIterator(triggers);
  }


  // ===================================================================================================================
  // Static Methods
  // ===================================================================================================================

  /**
   * Standard subscription filter function
   * @param {YosGraphQLContext} context
   * @param {YosControllerFunction} filterFn
   * @returns {Promise<boolean>}
   */
  public static async subscriptionFilter(context: YosGraphQLContext, filterFn?: YosControllerFunction): Promise<boolean> {

    // Init
    const data = _.has(context, 'info.fieldName') && _.has(context, 'parent.' + context.info.fieldName) ?
      context.parent[context.info.fieldName] : context.parent;
    const filter = _.get(context, 'args.filter', context.args);

    // Filter via own filter function
    if (filterFn) {
      return YosResolver.graphQL(filterFn, Object.assign({}, context, {args: {data, filter}}));
    }

    // Get data
    const plainData = JSON.parse(JSON.stringify(data));
    const filterData = _.merge({}, plainData, filter);

    // Compare plain data and filter data
    return _.isEqual(plainData, filterData);
  }
}
