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
  func: (...args: any[]) => void;

  /** ID of the hook action */
  id: string;

  /** Priority of the hook action */
  priority: number
}

/**
 * Interface for hook filter
 */
export interface YosHookFilter {

  /** Filter */
  func: (...args: any[]) => any;

  /** ID of the hook filter */
  id: string;

  /** Priority of the hook filter */
  priority: number
}

/**
 * Interface for filter hooks
 */
export interface YosFilterHooks {
  [hook: string]: YosHookFilter[];
}

