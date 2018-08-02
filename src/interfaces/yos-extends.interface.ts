/**
 * Implement YosExtends as a function
 */
export const YosExtends = Function;

/**
 * Interface for extended classes instead of using typeof, which no longer works with typescript version 3 and higher
 * See https://stackoverflow.com/a/44574843/1607153
 * and https://github.com/Microsoft/TypeScript/issues/5843
 * for solution: https://stackoverflow.com/a/39909209
 *
 *
 */
export interface YosExtends<T> extends Function {
  new (...args: any[]): T;
}
