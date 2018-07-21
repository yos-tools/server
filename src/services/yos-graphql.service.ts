import { ResolverFn, withFilter } from 'apollo-server';
import * as _ from 'lodash';
import {
  YosControllerFunction,
  YosGraphQLContext,
  YosResolver,
  YosServer,
  YosService,
  YosServiceConfig,
  YosSubscriptionService
} from '..';

/**
 * Service for GraphQL handling
 */
export class YosGraphQLService extends YosService {

  /** YosSubscriptionService must be loaded before YosGraphQLService */
  protected _subscriptionService: YosSubscriptionService;

  // ===================================================================================================================
  // Init
  // ===================================================================================================================

  /**
   * Init instance of GraphQL service
   *
   * Hint: YosSubscriptionService must be loaded before YosGraphQLService
   *
   * @param {YosServer} yosServer
   * @param {YosServiceConfig} config
   * @returns {YosGraphQLService}
   */
  public static init(yosServer: YosServer, config?: YosServiceConfig): YosGraphQLService {

    // New instance
    const yosGraphQLService = new YosGraphQLService(yosServer, config);

    // Init PubSub
    yosGraphQLService._subscriptionService = <any>yosServer.services.SubscriptionService;

    // Return instance
    return yosGraphQLService;
  }


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Subscription with optional filter handling
   * @param {string | string[]} triggers
   * @param {boolean} filter
   * @param {YosControllerFunction} filterFn
   * @returns {AsyncIterator<T> | ResolverFn}
   */
  public subscribe<T>(triggers: string | string[], filter: boolean = false, filterFn?: YosControllerFunction): AsyncIterator<T> | ResolverFn {

    if (filter) {
      return withFilter(
        () => this._subscriptionService.asyncIterator(triggers),
        (parent, args, context, info) => YosGraphQLService.subscriptionFilter({parent, args, context, info}, filterFn)
      );
    }

    return this._subscriptionService.asyncIterator(triggers);
  }


  // ===================================================================================================================
  // Static Methods
  // ===================================================================================================================

  /**
   * Standard subscribe filter function
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
