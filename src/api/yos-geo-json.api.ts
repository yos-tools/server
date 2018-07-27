import { YosSchemaDefinition } from '..';
import {
  Bbox,
  Feature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position
} from 'graphql-geojson-scalar-types';

/**
 * GeoJSON
 * @type {YosSchemaDefinition}
 *
 * See https://github.com/enniel/graphql-geojson-scalar-types
 * and http://geojson.org/
 */
export const YosCoreApi: YosSchemaDefinition = {

  // ===================================================================================================================
  // Type definitions
  // ===================================================================================================================

  typeDefs: `
  
    # ==================================================================================================================
    # GeoJSON Enums
    #
    # Following the specification: https://tools.ietf.org/html/rfc7946
    # ==================================================================================================================
    
    """
    The Bounding Box "bbox" values define shapes with edges that follow lines of constant longitude, latitude, and 
    elevation (see [GeoJSON Bounding Box](https://tools.ietf.org/html/rfc7946#section-5))
    """
    scalar GeoJSONBboxScalar
    
    """
    A Feature object represents a spatially bounded thing.  Every Feature object is a GeoJSON object no matter where it 
    occurs in a GeoJSON text.
    
    - A Feature object has a "type" member with the value "Feature".
    - A Feature object has a member with the name "geometry".  The value of the geometry member SHALL be either a 
      Geometry object as defined above or, in the case that the Feature is unlocated, a JSON null value.
    - A Feature object has a member with the name "properties".  The value of the properties member is an object 
      (any JSON object or a JSON null value).
      
    Example of a 2D bbox member on a Feature:
    \`\`\`
    {
      "type": "Feature",
      "bbox": [-10.0, -10.0, 10.0, 10.0],
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-10.0, -10.0],
            [10.0, -10.0],
            [10.0, 10.0],
            [-10.0, -10.0]
          ]
        ]
      }
      //...
    }
    \`\`\`
    
    (see [GeoJSON Feature](https://tools.ietf.org/html/rfc7946#section-3.2))
    """
    scalar GeoJSONFeatureScalar
    
    """
    A GeoJSON object with the type "FeatureCollection" is a FeatureCollection object.  A FeatureCollection object has a 
    member with the name "features".  The value of "features" is a JSON array. Each element of the array is a Feature 
    object as defined above. It is possible for this array to be empty.
    
    Example of a 2D bbox member on a FeatureCollection:
    \`\`\`
    {
      "type": "FeatureCollection",
      "bbox": [100.0, 0.0, 105.0, 1.0],
      "features": [
        //...
      ]
    }
    \`\`\`
    
    Example of a 3D bbox member with a depth of 100 meters:
    \`\`\`
    {
      "type": "FeatureCollection",
      "bbox": [100.0, 0.0, -100.0, 105.0, 1.0, 0.0],
      "features": [
        //...
      ]
    }
    \`\`\`
    
    (see [GeoJSON FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3))
    """
    scalar GeoJSONFeatureCollectionScalar
    
    """
    A Geometry object represents points, curves, and surfaces in coordinate space.  Every Geometry object is a GeoJSON 
    object no matter where it occurs in a GeoJSON text.
    
    (See [GeoJSON Geometry](https://tools.ietf.org/html/rfc7946#section-3.1))
    """
    scalar GeoJSONGeometryScalar
    
    """
    A GeoJSON object with type "GeometryCollection" is a Geometry object. A GeometryCollection has a member with the 
    name "geometries".  The value of "geometries" is an array.  Each element of this array is a GeoJSON Geometry object.  
    It is possible for this array to be empty.
    
    (See [GeoJSON GeometryCollection](https://tools.ietf.org/html/rfc7946#section-3.1.8))
    """
    scalar GeoJSONGeometryCollectionScalar
    
    """
    For type "LineString", the "coordinates" member is an array of two or more positions.
    
    Example:
    \`\`\`
    {
      "type": "LineString",
      "coordinates": [
        [100.0, 0.0],
        [101.0, 1.0]
      ]
    }
    \`\`\`
    
    (See [GeoJSON LineString](https://tools.ietf.org/html/rfc7946#section-3.1.4))
    """
    scalar GeoJSONLineStringScalar
    
    """
    For type "MultiLineString", the "coordinates" member is an array of LineString coordinate arrays.
    
    Example:
    \`\`\`
    {
      "type": "MultiLineString",
      "coordinates": [
        [
          [100.0, 0.0],
          [101.0, 1.0]
        ],
        [
          [102.0, 2.0],
          [103.0, 3.0]
        ]
      ]
    }
    \`\`\`
    
    (See [GeoJSON MultiLineString](https://tools.ietf.org/html/rfc7946#section-3.1.5))
    """
    scalar GeoJSONMultiLineStringScalar
    
    """
    For type "MultiPoint", the "coordinates" member is an array of positions.
    
    Example:
    \`\`\`
    {
      "type": "MultiPoint",
      "coordinates": [
        [100.0, 0.0],
        [101.0, 1.0]
      ]
    }
    \`\`\`
    
    (See [GeoJSON MultiPoint](https://tools.ietf.org/html/rfc7946#section-3.1.3))
    """
    scalar GeoJSONMultiPointScalar
    
    """
    For type "MultiPolygon", the "coordinates" member is an array of Polygon coordinate arrays.
    
    Example:
    \`\`\`
    {
      "type": "MultiPolygon",
      "coordinates": [
        [
          [
            [102.0, 2.0],
            [103.0, 2.0],
            [103.0, 3.0],
            [102.0, 3.0],
            [102.0, 2.0]
          ]
        ],
        [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ],
          [
            [100.2, 0.2],
            [100.2, 0.8],
            [100.8, 0.8],
            [100.8, 0.2],
            [100.2, 0.2]
          ]
        ]
      ]
    }
    \`\`\`
    
    (See: [GeoJSON MultiPolygon](https://tools.ietf.org/html/rfc7946#section-3.1.7))
    """
    scalar GeoJSONMultiPolygonScalar
    
    """
    For type "Point", the "coordinates" member is a single position.
    
    Example:
    \`\`\`
    {
      "type": "Point",
      "coordinates": [100.0, 0.0]
    }
    \`\`\`
    
    (See: [GeoJSON Point](https://tools.ietf.org/html/rfc7946#section-3.1.2))
    """
    scalar GeoJSONPointScalar
    
    """
    To specify a constraint specific to Polygons, it is useful to introduce the concept of a linear ring
   
    - A linear ring is a closed LineString with four or more positions.
    - The first and last positions are equivalent, and they MUST contain identical values; their representation SHOULD 
      also be identical.
    - A linear ring is the boundary of a surface or the boundary of a hole in a surface.
    - A linear ring MUST follow the right-hand rule with respect to the area it bounds, i.e., exterior rings are 
      counterclockwise, and holes are clockwise.
      
    Example with no holes:
    \`\`\`
    {
      "type": "Polygon",
      "coordinates": [
        [
          [100.0, 0.0],
          [101.0, 0.0],
          [101.0, 1.0],
          [100.0, 1.0],
          [100.0, 0.0]
        ]
      ]
    }
    \`\`\`
    
    Example with holes:
    \`\`\`
    {
      "type": "Polygon",
      "coordinates": [
        [
          [100.0, 0.0],
          [101.0, 0.0],
          [101.0, 1.0],
          [100.0, 1.0],
          [100.0, 0.0]
        ],
        [
          [100.8, 0.8],
          [100.8, 0.2],
          [100.2, 0.2],
          [100.2, 0.8],
          [100.8, 0.8]
        ]
      ]
    }
    \`\`\`
    
    (See: [GeoJSON Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6))
    """
    scalar GeoJSONPolygonScalar
    
    """
    A position is the fundamental geometry construct.  The "coordinates" member of a Geometry object is composed of 
    either:
    
    - one position in the case of a Point geometry,
    - an array of positions in the case of a LineString or MultiPoint geometry,
    - an array of LineString or linear ring (see Section 3.1.6) coordinates in the case of a Polygon or MultiLineString 
      geometry, or
    - an array of Polygon coordinates in the case of a MultiPolygon geometry.

    A position is an array of numbers.  There MUST be two or more elements.  The first two elements are longitude and 
    latitude, or easting and northing, precisely in that order and using decimal numbers.  Altitude or elevation MAY be 
    included as an optional third element.
   
    (See: [GeoJSON Position](https://tools.ietf.org/html/rfc7946#section-3.1.1))
    """
    scalar GeoJSONPositionScalar
  `,

  // ===================================================================================================================
  // Resolvers
  // ===================================================================================================================

  resolvers: {

    /** Resolver for any GeoJSON Bbox */
    GeoJSONBboxScalar: Bbox,

    /** Resolver for any GeoJSON Feature */
    GeoJSONFeatureScalar: Feature,

    /** Resolver for any GeoJSON FeatureCollection */
    GeoJSONFeatureCollectionScalar: FeatureCollection,

    /** Resolver for any GeoJSON Geometry */
    GeoJSONGeometryScalar: Geometry,

    /** Resolver for any GeoJSON GeometryCollection */
    GeoJSONGeometryCollectionScalar: GeometryCollection,

    /** Resolver for any GeoJSON LineString */
    GeoJSONLineStringScalar: LineString,

    /** Resolver for any GeoJSON MultiLineString */
    GeoJSONMultiLineStringScalar: MultiLineString,

    /** Resolver for any GeoJSON MultiPoint */
    GeoJSONMultiPointScalar: MultiPoint,

    /** Resolver for any GeoJSON MultiPolygon */
    GeoJSONMultiPolygonScalar: MultiPolygon,

    /** Resolver for any GeoJSON Point */
    GeoJSONPointScalar: Point,

    /** Resolver for any GeoJSON Polygon */
    GeoJSONPolygonScalar: Polygon,

    /** Resolver for any GeoJSON Position */
    GeoJSONPositionScalar: Position
 }
};
