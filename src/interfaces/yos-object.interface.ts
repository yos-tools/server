/**
 * Interface for a standard key value Javascript Object
 *
 * The interface is required in case "noImplicitAny": true is set in tsconfig.json:
 *
 * x: object = <any>{};
 * x['test'] = 'xxx'; // => TS7017: Element implicitly has an 'any' type because type '{}' has no index signature.
 * x.test = 'xxx'; // => TS2339: Property 'x' does not exist on type 'object'.
 *
 * x: YosObject = {};
 * x['test'] = 'xxx' // => works
 * x.test = 'xxx' // => works
 */
export interface YosObject {

  /** Key value object for any type of value */
  [key: string]: any
}
