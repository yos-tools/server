// Type definitions for graphql-geojson-scalar-types
// Project: https://www.npmjs.com/package/graphql-geojson-scalar-types
// Definitions by: Kai Haase <https://github.com/yostools>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'graphql-geojson-scalar-types' {

  import { GraphQLScalarType } from 'graphql/type/definition';

  export const Bbox: GraphQLScalarType;
  export const Feature: GraphQLScalarType;
  export const FeatureCollection: GraphQLScalarType;
  export const Geometry: GraphQLScalarType;
  export const GeometryCollection: GraphQLScalarType;
  export const LineString: GraphQLScalarType;
  export const MultiLineString: GraphQLScalarType;
  export const MultiPoint: GraphQLScalarType;
  export const MultiPolygon: GraphQLScalarType;
  export const Point: GraphQLScalarType;
  export const Polygon: GraphQLScalarType;
  export const Position: GraphQLScalarType;
}
