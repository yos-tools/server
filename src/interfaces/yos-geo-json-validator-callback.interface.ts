/**
 * Interface for GeoJSON validator callback function
 */
export interface YosGeoJsonValidatorCallback {

  /**
   * Callback function
   *
   * @param {boolean} valid - whether the previously evaluated GeoJSON object was valid or not
   * @param {string[]} messages - error messages
   *
   * @return {*} the return value is not processed further
   */
  (valid: boolean, messages: string[]): any
}
