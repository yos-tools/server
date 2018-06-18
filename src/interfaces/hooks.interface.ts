/**
 * Interface for action hooks
 */
export interface ActionHooks {
  [hook: string]: HookAction[];
}

/**
 * Interface for hook action
 */
export interface HookAction {

  // Action
  func: (...args: any[]) => void;

  // Name of the hook action
  name: string;

  // Priority of the hook action
  priority: number
}

/**
 * Interface for hook filter
 */
export interface HookFilter {

  // Filter
  func: (...args: any[]) => any;

  // Name of the hook filter
  name: string;

  // Priority of the hook filter
  priority: number
}

/**
 * Interface for filter hooks
 */
export interface FilterHooks {
  [hook: string]: HookFilter[];
}

