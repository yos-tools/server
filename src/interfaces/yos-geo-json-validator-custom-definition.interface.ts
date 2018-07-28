/**
 * Interface for GeoJSON validator definition function
 */
export interface YosGeoJsonValidatorCustomDefinition {

  /**
   * Function which validates an object
   *
   * If everything is ok, then zero is returned.
   * Otherwise, an error message is returned as a string or
   * several error messages are returned in the form of a string array.
   *
   * @param {*} object
   * @return {null | string | string[]} error messages
   */
  (object: any): null | string | string []
}
