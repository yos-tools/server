import { YosObject } from './yos-object.interface';

/**
 * Interface for action hooks
 */
export interface YosActionHooks {
  [hook: string]: YosHookAction[];
}

/**
 * Interface for hook action
 */
export interface YosHookAction {

  /** Action */
  func: (config: YosObject) => void;

  /** ID of the hook action */
  id: string;

  /** Priority of the hook action */
  priority?: number

  /** Arguments for the hook action */
  config?: YosObject;
}

/**
 * Interface for hook filter
 */
export interface YosHookFilter {

  /** Filter */
  func: (value: any, config?: YosObject) => any;

  /** ID of the hook filter */
  id: string;

  /** Priority of the hook filter */
  priority?: number;

  /** Other arguments for the hook filter besides value */
  config?: YosObject;
}

/**
 * Interface for filter hooks
 */
export interface YosFilterHooks {
  [hook: string]: YosHookFilter[];
}

