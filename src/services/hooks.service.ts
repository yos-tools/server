import * as _ from 'lodash';
import { ActionHooks, FilterHooks, HookAction, HookFilter } from '..';

/**
 * Service for hooks
 */
export class HooksService {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  // Action hooks perform an action at the called point
  protected _actions: ActionHooks = {};

  // Filter hooks can change a value at the called location and must therefore necessarily return a value
  protected _filters: FilterHooks = {};


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Perform action
   * @param {string} hook Name of the hook
   * @param args Parameters for action function
   * @returns {Promise<void>}
   */
  async performActions(hook: string, ...args: any[]): Promise<void> {
    for (const action of this._actions[hook]) {
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
    for (const filter of this._filters[hook]) {
      await filter.func(...args);
    }
  }

  /**
   * Add action
   * @param {string} hook Name of the hook
   * @param {HookAction} action
   */
  addAction(hook: string, action: HookAction): void {
    this._actions[hook].push(action);
    _.sortBy(this._actions[hook], 'priority')
  }

  /**
   * Add filter
   * @param {string} hook
   * @param {HookFilter} filter
   */
  addFilter(hook: string, filter: HookFilter): void {
    this._filters[hook].push(filter);
    _.sortBy(this._filters[hook], 'priority')
  }

  /**
   * Remove action
   * @param {string} hook
   * @param {string} action
   */
  removeAction(hook: string, action: string): void {
    _.remove(this._actions[hook], (element) => {
      return element.name === action;
    })
  }

  /**
   * Remove filter
   * @param {string} hook
   * @param {string} filter
   */
  removeFilter(hook: string, filter: string): void {
    _.remove(this._filters[hook], (element) => {
      return element.name === filter;
    })
  }

  /**
   * Remove action from all hooks
   * @param {string} action
   */
  removeActionFromAllHooks(action: string): void {
    for (const prop of Object.getOwnPropertyNames(this._actions)) {
      _.remove(this._actions[prop], (element) => {
        return element.name === action;
      })
    }
  }

  /**
   * Remove filter from all hooks
   * @param {string} filter
   */
  removeFilterFromAllHooks(filter: string): void {
    for (const prop of Object.getOwnPropertyNames(this._filters)) {
      _.remove(this._filters[prop], (element) => {
        return element.name === filter;
      })
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
