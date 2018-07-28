import { YosGeoJsonValidatorCallback, YosGeoJsonValidatorCustomDefinition, YosGeoJsonValidatorDefinition } from '..';

/**
 * GeoJSON validator
 *
 * See http://geojson.org/
 * Inspired by https://github.com/craveprogramminginc/GeoJSON-Validation
 */
export class YosGeoJsonValidator {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /**
   * Custom validation functions
   */
  public static definitions: { [definition: string]: YosGeoJsonValidatorCustomDefinition } = {};

  /**
   * Non geo types
   */
  public static readonly nonGeoTypes: { [type: string]: YosGeoJsonValidatorDefinition } = {
    Feature: YosGeoJsonValidator.isFeature,
    FeatureCollection: YosGeoJsonValidator.isFeatureCollection
  };

  /**
   * Geo types
   */
  public static readonly geoTypes: { [type: string]: YosGeoJsonValidatorDefinition } = {
    GeometryCollection: YosGeoJsonValidator.isGeometryCollection,
    LineString: YosGeoJsonValidator.isLineString,
    MultiLineString: YosGeoJsonValidator.isMultiLineString,
    MultiPoint: YosGeoJsonValidator.isMultiPoint,
    MultiPolygon: YosGeoJsonValidator.isMultiPolygon,
    Point: YosGeoJsonValidator.isPoint,
    Polygon: YosGeoJsonValidator.isPolygon
  };

  /**
   * All types
   */
  public static readonly allTypes: { [type: string]: YosGeoJsonValidatorDefinition } = {
    Bbox: YosGeoJsonValidator.isBbox,
    Feature: YosGeoJsonValidator.isFeature,
    FeatureCollection: YosGeoJsonValidator.isFeatureCollection,
    GeoJSON: YosGeoJsonValidator.isGeoJSONObject,
    GeometryCollection: YosGeoJsonValidator.isGeometryCollection,
    GeometryObject: YosGeoJsonValidator.isGeometryObject,
    LineString: YosGeoJsonValidator.isLineString,
    MultiLineString: YosGeoJsonValidator.isMultiLineString,
    MultiPoint: YosGeoJsonValidator.isMultiPoint,
    MultiPolygon: YosGeoJsonValidator.isMultiPolygon,
    Point: YosGeoJsonValidator.isPoint,
    Polygon: YosGeoJsonValidator.isPolygon,
    Position: YosGeoJsonValidator.isPosition
  };

  // ===================================================================================================================
  // Helper Methods
  // ===================================================================================================================

  /**
   * Test an object to see if it is a function
   * @param {*} object
   * @return {boolean}
   */
  public static isFunction(object: any): boolean {
    return typeof (object) === 'function';
  }

  /**
   * A truthy test for objects
   * @param {*} object
   * @return {boolean}
   */
  public static isObject(object: any): boolean {
    return object === Object(object);
  }

  /**
   * Formats error messages, calls the callback
   * @param {YosGeoJsonValidatorCallback} callback
   * @param {string | [string]} errorMessages - error message(s)
   * @return {boolean} is the object valid or not?
   */
  protected static done(callback: YosGeoJsonValidatorCallback, errorMessages: string | string[]): boolean {

    // Init
    let messages: string[] = [];
    let valid = false;

    // Evaluate message
    if (typeof errorMessages === 'string') {
      messages = [errorMessages];
    } else if (Object.prototype.toString.call(errorMessages) === '[object Array]') {
      messages = errorMessages;
      if (messages.length === 0) {
        valid = true;
      }
    } else {
      valid = true;
    }

    // Call callback function
    if (YosGeoJsonValidator.isFunction(callback)) {
      callback(valid, messages);
    }

    // Return result
    return valid;
  }

  /**
   * Calls a custom definition if one is available for the given type
   * @param {string} type - a GeoJSON object type
   * @param {any} object - the Object being tested
   * @return {string[]} an array of errors
   */
  protected static customDefinitions(type: string, object: any): string[] {

    // Init
    let errors: string[];
    let result: string | string [];

    // Check object if custom definition exists
    if (YosGeoJsonValidator.isFunction(YosGeoJsonValidator.definitions[type])) {
      try {
        result = YosGeoJsonValidator.definitions[type](object);
      } catch (e) {
        errors = ['Problem with custom definition for ' + type + ': ' + e];
      }
      if (typeof result === 'string') {
        errors = [result];
      }
      if (Object.prototype.toString.call(errors) === '[object Array]') {
        return errors;
      }
    }
    return [];
  }

  /**
   * Define a custom validation function for one of GeoJSON objects
   * @param type {GeoJSON Type} the type
   * @param {YosGeoJsonValidatorCustomDefinition} definition - A validation function
   * @return {Boolean} Return true if the function was loaded correctly else false
   */
  public static define(type: string, definition: YosGeoJsonValidatorCustomDefinition): boolean {
    if ((type in YosGeoJsonValidator.allTypes) && YosGeoJsonValidator.isFunction(definition)) {
      YosGeoJsonValidator.definitions[type] = definition;
      return true;
    } else {
      return false;
    }
  }


  // ===================================================================================================================
  // GeoJSON validation methods
  // ===================================================================================================================

  /**
   * Determines if an object is a position or not
   * @param {number[]} position
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isPosition(position: number[], callback?: YosGeoJsonValidatorCallback): boolean {
    let errors: string[] = [];

    // It must be an array
    if (Array.isArray(position)) {

      // and the array must have more than one element
      if (position.length <= 1) {
        errors.push('Position must be at least two elements');
      }

      position.forEach(function (pos, index) {
        if (typeof pos !== 'number') {
          errors.push('Position must only contain numbers. Item ' + pos + ' at index ' + index + ' is invalid.');
        }
      });
    } else {
      errors.push('Position must be an array');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('Position', position));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a GeoJSON Object or not
   * @param {*} geoJSONObject
   * @param {YosGeoJsonValidatorCallback} callback - the callback
   * @return {boolean}
   */
  public static isGeoJSONObject(geoJSONObject: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(geoJSONObject)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    } else {
      let errors = [];
      if ('type' in geoJSONObject) {
        if (YosGeoJsonValidator.nonGeoTypes[geoJSONObject.type]) {
          return YosGeoJsonValidator.nonGeoTypes[geoJSONObject.type](geoJSONObject, callback);
        } else if (YosGeoJsonValidator.geoTypes[geoJSONObject.type]) {
          return YosGeoJsonValidator.geoTypes[geoJSONObject.type](geoJSONObject, callback);
        } else {
          errors.push('type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", or "FeatureCollection"');
        }
      } else {
        errors.push('must have a member with the name "type"');
      }

      // run custom checks
      errors = errors.concat(YosGeoJsonValidator.customDefinitions('GeoJSONObject', geoJSONObject));
      return YosGeoJsonValidator.done(callback, errors);
    }
  }

  /**
   * Checks if geoJSONObject is a valid GeoJSON object
   * @param {*} geoJSONObject
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static valid(geoJSONObject: any, callback?: YosGeoJsonValidatorCallback): boolean {
    return this.isGeoJSONObject(geoJSONObject, callback);
  }

  /**
   * Determines if an object is a Geometry Object or not
   * @param {*} geometryObject
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isGeometryObject(geometryObject: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(geometryObject)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('type' in geometryObject) {
      if (YosGeoJsonValidator.geoTypes[geometryObject.type]) {
        return YosGeoJsonValidator.geoTypes[geometryObject.type](geometryObject, callback);
      } else {
        errors.push('type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon" or "GeometryCollection"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('GeometryObject', geometryObject));
    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a Point or not
   * @param {*} point
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isPoint(point: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(point)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in point) {
      YosGeoJsonValidator.isBbox(point.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in point) {
      if (point.type !== 'Point') {
        errors.push('type must be "Point"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if ('coordinates' in point) {
      YosGeoJsonValidator.isPosition(point.coordinates, (valid: boolean) => {
        if (!valid) {
          errors.push('Coordinates must be a single position');
        }
      });
    } else {
      errors.push('must have a member with the name "coordinates"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('Point', point));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an array can be interperted as coordinates for a MultiPoint
   * @param {*} coordinates
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isMultiPointCoordinates(coordinates: any, callback?: YosGeoJsonValidatorCallback): boolean {
    let errors: string[] = [];

    if (Array.isArray(coordinates)) {
      coordinates.forEach((val: any, index: number) => {
        YosGeoJsonValidator.isPosition(val, (valid: boolean, err: string[]) => {
          if (!valid) {
            // modify the err msg from "isPosition" to note the element number
            err[0] = 'at ' + index + ': '.concat(err[0]);
            // build a list of invalide positions
            errors = errors.concat(err);
          }
        });
      });
    } else {
      errors.push('coordinates must be an array');
    }

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a MultiPoint or not
   * @param {*} multiPoint
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isMultiPoint(multiPoint: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(multiPoint)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in multiPoint) {
      YosGeoJsonValidator.isBbox(multiPoint.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in multiPoint) {
      if (multiPoint.type !== 'MultiPoint') {
        errors.push('type must be "MultiPoint"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if ('coordinates' in multiPoint) {
      YosGeoJsonValidator.isMultiPointCoordinates(multiPoint.coordinates, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    } else {
      errors.push('must have a member with the name "coordinates"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('MultiPoint', multiPoint));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an array can be interperted as coordinates for a lineString
   * @param {*} coordinates
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isLineStringCoordinates(coordinates: any, callback?: YosGeoJsonValidatorCallback): boolean {
    let errors: string[] = [];
    if (Array.isArray(coordinates)) {
      if (coordinates.length > 1) {
        coordinates.forEach((val: any, index: number) => {
          YosGeoJsonValidator.isPosition(val, (valid: boolean, err: string[]) => {
            if (!valid) {
              // modify the err msg from 'isPosition' to note the element number
              err[0] = 'at ' + index + ': '.concat(err[0]);
              // build a list of invalide positions
              errors = errors.concat(err);
            }
          });
        });
      } else {
        errors.push('coordinates must have at least two elements');
      }
    } else {
      errors.push('coordinates must be an array');
    }

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a lineString or not
   * @param {*} lineString
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isLineString(lineString: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(lineString)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in lineString) {
      YosGeoJsonValidator.isBbox(lineString.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in lineString) {
      if (lineString.type !== 'LineString') {
        errors.push('type must be "LineString"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if ('coordinates' in lineString) {
      YosGeoJsonValidator.isLineStringCoordinates(lineString.coordinates, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    } else {
      errors.push('must have a member with the name "coordinates"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('LineString', lineString));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an array can be interperted as coordinates for a MultiLineString
   * @param {*} coordinates
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isMultiLineStringCoordinates(coordinates: any, callback?: YosGeoJsonValidatorCallback): boolean {
    let errors: string[] = [];
    if (Array.isArray(coordinates)) {
      coordinates.forEach((val: any, index: number) => {
        YosGeoJsonValidator.isLineStringCoordinates(val, (valid: boolean, err: string[]) => {
          if (!valid) {
            // modify the err msg from 'isPosition' to note the element number
            err[0] = 'at ' + index + ': '.concat(err[0]);
            // build a list of invalide positions
            errors = errors.concat(err);
          }
        });
      });
    } else {
      errors.push('coordinates must be an array');
    }
    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a MultiLine String or not
   * @param {*} multiLineString
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isMultiLineString(multiLineString: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(multiLineString)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in multiLineString) {
      YosGeoJsonValidator.isBbox(multiLineString.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in multiLineString) {
      if (multiLineString.type !== 'MultiLineString') {
        errors.push('type must be "MultiLineString"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if ('coordinates' in multiLineString) {
      YosGeoJsonValidator.isMultiLineStringCoordinates(multiLineString.coordinates, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    } else {
      errors.push('must have a member with the name "coordinates"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('MultiPoint', multiLineString));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an array is a linear Ring String or not
   * @param {*} coordinates
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isLinearRingCoordinates(coordinates: any, callback?: YosGeoJsonValidatorCallback): boolean {
    let errors: string[] = [];
    if (Array.isArray(coordinates)) {
      // 4 or more positions

      coordinates.forEach((val: any, index: number) => {
        YosGeoJsonValidator.isPosition(val, (valid: boolean, err: string[]) => {
          if (!valid) {
            // modify the err msg from 'isPosition' to note the element number
            err[0] = 'at ' + index + ': '.concat(err[0]);
            // build a list of invalide positions
            errors = errors.concat(err);
          }
        });
      });

      // check the first and last positions to see if they are equivalent
      // Todo: maybe better checking?
      if (coordinates[0].toString() !== coordinates[coordinates.length - 1].toString()) {
        errors.push('The first and last positions must be equivalent');
      }

      if (coordinates.length < 4) {
        errors.push('coordinates must have at least four positions');
      }
    } else {
      errors.push('coordinates must be an array');
    }

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an array is valid Polygon Coordinates or not
   * @param {*} coordinates
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isPolygonCoor(coordinates: any, callback?: YosGeoJsonValidatorCallback): boolean {
    let errors: string[] = [];
    if (Array.isArray(coordinates)) {
      coordinates.forEach((val: any, index: number) => {
        YosGeoJsonValidator.isLinearRingCoordinates(val, (valid: boolean, err: string[]) => {
          if (!valid) {
            // modify the err msg from 'isPosition' to note the element number
            err[0] = 'at ' + index + ': '.concat(err[0]);
            // build a list of invalid positions
            errors = errors.concat(err);
          }
        });
      });
    } else {
      errors.push('coordinates must be an array');
    }

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a valid Polygon
   * @param {*} polygon
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isPolygon(polygon: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(polygon)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in polygon) {
      YosGeoJsonValidator.isBbox(polygon.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in polygon) {
      if (polygon.type !== 'Polygon') {
        errors.push('type must be "Polygon"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if ('coordinates' in polygon) {
      YosGeoJsonValidator.isPolygonCoor(polygon.coordinates, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    } else {
      errors.push('must have a member with the name "coordinates"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('Polygon', polygon));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an array can be interperted as coordinates for a MultiPolygon
   * @param {*} coordinates
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isMultiPolygonCoor(coordinates: any, callback?: YosGeoJsonValidatorCallback): boolean {
    let errors: string[] = [];
    if (Array.isArray(coordinates)) {
      coordinates.forEach((val: any, index: number) => {
        YosGeoJsonValidator.isPolygonCoor(val, (valid: boolean, err: string[]) => {
          if (!valid) {
            // modify the err msg from 'isPosition' to note the element number
            err[0] = 'at ' + index + ': '.concat(err[0]);
            // build a list of invalide positions
            errors = errors.concat(err);
          }
        });
      });
    } else {
      errors.push('coordinates must be an array');
    }

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a valid MultiPolygon
   * @param {*} multiPolygon
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isMultiPolygon(multiPolygon: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(multiPolygon)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in multiPolygon) {
      YosGeoJsonValidator.isBbox(multiPolygon.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in multiPolygon) {
      if (multiPolygon.type !== 'MultiPolygon') {
        errors.push('type must be "MultiPolygon"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if ('coordinates' in multiPolygon) {
      YosGeoJsonValidator.isMultiPolygonCoor(multiPolygon.coordinates, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    } else {
      errors.push('must have a member with the name "coordinates"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('MultiPolygon', multiPolygon));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a valid Geometry Collection
   * @param {*} geometryCollection
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isGeometryCollection(geometryCollection: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(geometryCollection)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in geometryCollection) {
      YosGeoJsonValidator.isBbox(geometryCollection.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in geometryCollection) {
      if (geometryCollection.type !== 'GeometryCollection') {
        errors.push('type must be "GeometryCollection"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if ('geometries' in geometryCollection) {
      if (Array.isArray(geometryCollection.geometries)) {
        geometryCollection.geometries.forEach((val: any, index: number) => {
          YosGeoJsonValidator.isGeometryObject(val, (valid: boolean, err: string[]) => {
            if (!valid) {
              // modify the err msg from 'isPosition' to note the element number
              err[0] = 'at ' + index + ': '.concat(err[0]);
              // build a list of invalid positions
              errors = errors.concat(err);
            }
          });
        });
      } else {
        errors.push('"geometries" must be an array');
      }
    } else {
      errors.push('must have a member with the name "geometries"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('GeometryCollection', geometryCollection));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a valid Feature
   * @param {*} feature
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isFeature(feature: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(feature)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in feature) {
      YosGeoJsonValidator.isBbox(feature.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in feature) {
      if (feature.type !== 'Feature') {
        errors.push('type must be "Feature"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if (!('properties' in feature)) {
      errors.push('must have a member with the name "properties"');
    }

    if ('geometry' in feature) {
      if (feature.geometry !== null) {
        YosGeoJsonValidator.isGeometryObject(feature.geometry, (valid: boolean, err: string[]) => {
          if (!valid) {
            errors = errors.concat(err);
          }
        });
      }
    } else {
      errors.push('must have a member with the name "geometry"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('Feature', feature));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a valid Feature Collection
   * @param {*} featureCollection
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isFeatureCollection(featureCollection: any, callback?: YosGeoJsonValidatorCallback): boolean {
    if (!YosGeoJsonValidator.isObject(featureCollection)) {
      return YosGeoJsonValidator.done(callback, ['must be a JSON Object']);
    }

    let errors: string[] = [];

    if ('bbox' in featureCollection) {
      YosGeoJsonValidator.isBbox(featureCollection.bbox, (valid: boolean, err: string[]) => {
        if (!valid) {
          errors = errors.concat(err);
        }
      });
    }

    if ('type' in featureCollection) {
      if (featureCollection.type !== 'FeatureCollection') {
        errors.push('type must be "FeatureCollection"');
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    if ('features' in featureCollection) {
      if (Array.isArray(featureCollection.features)) {
        featureCollection.features.forEach((val: any, index: number) => {
          YosGeoJsonValidator.isFeature(val, (valid: boolean, err: string[]) => {
            if (!valid) {
              // modify the err msg from 'isPosition' to note the element number
              err[0] = 'at ' + index + ': '.concat(err[0]);
              // build a list of invalide positions
              errors = errors.concat(err);
            }
          });
        });
      } else {
        errors.push('"Features" must be an array');
      }
    } else {
      errors.push('must have a member with the name "Features"');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('FeatureCollection', featureCollection));

    return YosGeoJsonValidator.done(callback, errors);
  }

  /**
   * Determines if an object is a valid Bounding Box
   * @param {*} bbox
   * @param {YosGeoJsonValidatorCallback} callback
   * @return {boolean} indicates whether the object is valid
   */
  public static isBbox(bbox: any, callback?: YosGeoJsonValidatorCallback): boolean {
    let errors: string[] = [];
    if (Array.isArray(bbox)) {
      if (bbox.length % 2 !== 0) {
        errors.push('bbox, must be a 2*n array');
      }
    } else {
      errors.push('bbox must be an array');
    }

    // run custom checks
    errors = errors.concat(YosGeoJsonValidator.customDefinitions('Bbox', bbox));

    return YosGeoJsonValidator.done(callback, errors);
  }
}
