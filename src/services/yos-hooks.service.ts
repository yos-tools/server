import * as _ from 'lodash';
import {
  YosActionHook,
  YosActionHooks,
  YosFilterHook,
  YosFilterHooks,
  YosHelper,
  YosHookAction,
  YosHookFilter,
  YosObject,
  YosServer,
  YosService
} from '..';

/**
 * Service for hooks
 */
export class YosHooksService extends YosService {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /** Action hooks perform an action at the called point */
  protected _actions: YosActionHooks = {};

  /** Filter hooks can change a value at the called location and must therefore necessarily return a value */
  protected _filters: YosFilterHooks = {};


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Initialization of new hooks service instance
   * @returns {YosHooksService}
   */
  public static init(yosServer: YosServer): YosHooksService {
    return new YosHooksService(yosServer);
  }

  /**
   * Perform action
   * @param {YosActionHook} hook - Name of the hook
   * @param config - Configuration for action hook
   * @returns {Promise<void>}
   */
  async performActions(hook: YosActionHook, config?: YosObject): Promise<void> {
    const actions = this._actions[hook] || [];
    for (const action of actions) {
      await action.func(YosHelper.specialMerge({}, action.config, config));
    }
  }

  /**
   * Perform filter
   * @param {string} hook - Name of the hook
   * @param {value} value - value to be processed
   * @param config - Configuration for filter hook
   * @returns {Promise<any>}
   */
  async performFilters(hook: YosFilterHook, value: any, config?: YosObject): Promise<any> {
    const filters = this._filters[hook] || [];
    for (const filter of filters) {
      value = await filter.func(value, YosHelper.specialMerge({}, filter.config, config));
    }
    return value;
  }

  /**
   * Add action
   * @param {string} hook Name of the hook
   * @param {YosHookAction} action
   */
  addAction(hook: string, action: YosHookAction): void {
    if (!action.priority) {
      action.priority = 0;
    }
    this.removeAction(hook, action.id);
    this._actions[hook] = this._actions[hook] || [];
    this._actions[hook].push(action);
    _.orderBy(this._actions[hook], ['priority'], ['desc']);
  }

  /**
   * Add filter
   * @param {string} hook
   * @param {YosHookFilter} filter
   */
  addFilter(hook: string, filter: YosHookFilter): void {
    if (!filter.priority) {
      filter.priority = 0;
    }
    this.removeAction(hook, filter.id);
    this._filters[hook] = this._filters[hook] || [];
    this._filters[hook].push(filter);
    _.orderBy(this._filters[hook], ['priority'], ['desc']);
  }

  /**
   * Remove action
   * @param {string} hook
   * @param {string} action
   */
  removeAction(hook: string, action: string): void {
    _.remove(this._actions[hook], (element) => {
      return element.id === action;
    });
  }

  /**
   * Remove filter
   * @param {string} hook
   * @param {string} filter
   */
  removeFilter(hook: string, filter: string): void {
    _.remove(this._filters[hook], (element) => {
      return element.id === filter;
    });
  }

  /**
   * Remove action from all hooks
   * @param {string} action
   */
  removeActionFromAllHooks(action: string): void {
    for (const prop of Object.getOwnPropertyNames(this._actions)) {
      _.remove(this._actions[prop], (element) => {
        return element.id === action;
      });
    }
  }

  /**
   * Remove filter from all hooks
   * @param {string} filter
   */
  removeFilterFromAllHooks(filter: string): void {
    for (const prop of Object.getOwnPropertyNames(this._filters)) {
      _.remove(this._filters[prop], (element) => {
        return element.id === filter;
      });
    }
  }

  /**
   * Clear action
   * @param {string} hook
   */
  clearActionHook(hook: string): void {
    this._actions[hook] = [];
  }

  /**
   * Clear filter
   * @param {string} hook
   */
  clearFilterHook(hook: string): void {
    this._filters[hook] = [];
  }

  /**
   * Clear all action hooks
   */
  clearAllActionHooks(): void {
    this._actions = {};
  }

  /**
   * Clear all filter hooks
   */
  clearAllFilterHooks(): void {
    this._filters = {};
  }
}
