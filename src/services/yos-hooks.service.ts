import * as _ from 'lodash';
import { YosActionHooks, YosFilterHooks, YosHookAction, YosHookFilter, YosServer, YosService } from '..';

/**
 * Service for hooks
 */
export class YosHooksService extends YosService {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  // Action hooks perform an action at the called point
  protected _actions: YosActionHooks = {};

  // Filter hooks can change a value at the called location and must therefore necessarily return a value
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
   * @param {string} hook Name of the hook
   * @param args Parameters for action function
   * @returns {Promise<void>}
   */
  async performActions(hook: string, ...args: any[]): Promise<void> {
    const actions = this._actions[hook] || [];
    for (const action of actions) {
      await action.func(...args);
    }
  }

  /**
   * Perform filter
   * @param {string} hook Name of the hook
   * @param args Parameters for filter function
   * @returns {Promise<void>}
   */
  async performFilters(hook: string, ...args: any[]): Promise<void> {
    const filters = this._filters[hook] || [];
    for (const filter of filters) {
      await filter.func(...args);
    }
  }

  /**
   * Add action
   * @param {string} hook Name of the hook
   * @param {YosHookAction} action
   */
  addAction(hook: string, action: YosHookAction): void {
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
