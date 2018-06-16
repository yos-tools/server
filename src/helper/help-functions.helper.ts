import * as _ from 'lodash';

export class HelpFunctions {


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
  public static specialMerge(object: any, ...sources: any[]): any {
    return _.mergeWith(object, ...sources, (objValue: any, srcValue: any) => {
      if (_.isArray(srcValue)) {
        return srcValue;
      }
    });
  }

}
