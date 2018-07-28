import { YosGeoJsonValidatorCallback } from '..';

/**
 * Interface for GeoJSON validator definition function
 */
export interface YosGeoJsonValidatorDefinition {

  /**
   * Function which validates an object
   *
   * If everything is ok, then zero is returned.
   * Otherwise, an error message is returned as a string or
   * several error messages are returned in the form of a string array.
   *
   * @param {*} object
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean}
   */
  (object: any, callback?: YosGeoJsonValidatorCallback): boolean;
}
