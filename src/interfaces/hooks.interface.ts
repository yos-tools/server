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

  // ID of the hook action
  id: string;

  // Priority of the hook action
  priority: number
}

/**
 * Interface for hook filter
 */
export interface HookFilter {

  // Filter
  func: (...args: any[]) => any;

  // ID of the hook filter
  id: string;

  // Priority of the hook filter
  priority: number
}

/**
 * Interface for filter hooks
 */
export interface FilterHooks {
  [hook: string]: HookFilter[];
}

