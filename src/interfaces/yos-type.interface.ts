/**
 *
 */
export const YosType = Function;

export interface YosType<T> extends Function {
  new (...args: any[]): T;
}
