import * as _ from 'lodash';
import * as request from 'request-promise-native';
import { YosObject } from '..';

/**
 * General help functions
 */
export class YosHelper {

  /**
   * Request handling
   * See https://github.com/request/request-promise
   */
  public static request = request;

  /**
   * Special merge function (e.g. for configurations)
   *
   * It acts like the merge function of lodash:
   * - Source objects are merged into the destination object
   * - Source objects are applied from left to right
   * - Subsequent sources overwrite property assignments of previous sources
   *
   * except that arrays are not merged but overwrite arrays of previous sources.
   *
   * @param {any} object destination object
   * @param {any[]} sources source objects
   * @returns {any}
   */
  public static specialMerge(object: YosObject, ...sources: any[]): any {
    return _.mergeWith(object, ...sources, (objValue: any, srcValue: any) => {
      if (_.isArray(srcValue)) {
        return srcValue;
      }
    });
  }

  /**
   * Get plain data object, without functions or not own properties
   * @param object
   */
  public static plainDataObject(object: YosObject): any {
    return JSON.parse(JSON.stringify(object));
  }

  /**
   * Prepare URL
   *
   * @param {any} url URL
   * @param {string} defaultUrl If the URL is not a string or its length is less than 1, default is used
   * @param {boolean} leadingSlash Specifies whether a leading slash is to be used
   * @returns {string}
   */
  public static prepareUrl(url: any, defaultUrl: string, leadingSlash: boolean): string {
    url = _.isString(url) && url.length > 0 ? url : defaultUrl;
    if (leadingSlash && url.charAt(0) !== '/') {
      url = '/' + url;
    } else if (!leadingSlash && url.charAt(0) === '/') {
      url = url.substr(1);
    }
    return url;
  }

  /**
   * Get class name of class
   * @param item
   * @returns {string}
   */
  public static getClassName(item: any): string {
    let classNameRegEx = /(?:\S+\s+){1}([a-zA-Z_$][0-9a-zA-Z_$]*)/;
    return classNameRegEx.exec(item.toString())[1];
  }

  /**
   * Call deep (async) object function
   */
  public static async callDeepObjectFunction(objects: any, functionName: string, params: any[] = [], clone: boolean = true,  prepared: any[] = []): Promise<any> {

    // Check for prepared object to avoid infinite regress
    const preparedObject = prepared.find((item) => {
      return item === objects;
    });
    if (preparedObject) {
      return preparedObject;
    }

    // Process array
    if (Array.isArray(objects)) {

      // Clone the object once to prevent overwriting the original data
      if (clone) {
        objects = _.cloneDeep(objects);
      }

      // Set array as prepared
      prepared.push(objects);

      // Process array
      objects = objects.map(async (item: any) => {
        return await YosHelper.callDeepObjectFunction(item, functionName, params, false, prepared);
      });
      await Promise.all(objects);

      // Return array
      return objects;
    }

    // Process object
    if (typeof objects === 'object') {

      // Clone the object once to prevent overwriting the original data
      if (clone) {
        objects = _.cloneDeep(objects);
      }

      // Set object as prepared
      prepared.push(objects);

      // Process object
      for (const [ key, value ] of Object.entries(objects)) {
        objects[key] = await YosHelper.callDeepObjectFunction(value, functionName, params, false, prepared);
      }

      // Return object (with prepared data)
      return await typeof objects[functionName] === 'function' ? objects[functionName](...params) : objects;
    }

    // Return non array / object
    return objects;
  }
}
