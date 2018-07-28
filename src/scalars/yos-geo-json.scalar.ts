import { GraphQLError, GraphQLScalarType } from 'graphql';
import { YosGeoJsonValidator, YosGraphQL } from '..';

/**
 * Dynamic GeoJSON scalar
 */
export class YosGeoJsonScalar {

  /**
   * Validate a GeoJSON scalar
   * @param type
   * @param value
   */
  public static validate(type: string, value: any): any {

    // Check type
    if (!((<any>YosGeoJsonValidator)['is' + type] instanceof Function)) {
      throw new GraphQLError(`${type} is an unknown GeoJSON type`);
    }

    // Check value
    if (!(<any>YosGeoJsonValidator)['is' + type](value)) {
      throw new GraphQLError(`Expected GeoJSON ${type} but got: ${JSON.stringify(value)}`);
    }

    // Return unchanged value
    return value;
  }

  /**
   * Get a GeoJSON scalar
   * @param type - GeoJSON type
   * @param prefix - Prefix for scalar name
   * @param suffix - Suffix for scalar name
   */
  public static get(type: string, prefix: string = 'GeoJson', suffix: string = '') {
    return new GraphQLScalarType({
      name: prefix + type + suffix,
      serialize: (value: any) => {
        return YosGeoJsonScalar.validate(type, value);
      },
      parseValue: (value: any) => {
        return YosGeoJsonScalar.validate(type, value);
      },
      parseLiteral: YosGraphQL.parseLiteral
    });
  }
}
