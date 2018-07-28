import { YosSchemaDefinition } from '..';
import { YosGeoJsonScalar } from '../scalars/yos-geo-json.scalar';

/**
 * GeoJson
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
    # GeoJson Enums
    #
    # Following the specification: https://tools.ietf.org/html/rfc7946
    # ==================================================================================================================
    
    """
    The Bounding Box "bbox" values define shapes with edges that follow lines of constant longitude, latitude, and 
    elevation (see [GeoJson Bounding Box](https://tools.ietf.org/html/rfc7946#section-5))
    """
    scalar GeoJsonBbox
    
    """
    A Feature object represents a spatially bounded thing.  Every Feature object is a GeoJson object no matter where it 
    occurs in a GeoJson text.
    
    - A Feature object has a "type" member with the value "Feature".
    - A Feature object has a member with the name "geometry".  The value of the geometry member SHALL be either a 
      Geometry object as defined above or, in the case that the Feature is unlocated, a Json null value.
    - A Feature object has a member with the name "properties".  The value of the properties member is an object 
      (any Json object or a Json null value).
      
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
    
    (see [GeoJson Feature](https://tools.ietf.org/html/rfc7946#section-3.2))
    """
    scalar GeoJsonFeature
    
    """
    A GeoJson object with the type "FeatureCollection" is a FeatureCollection object.  A FeatureCollection object has a 
    member with the name "features".  The value of "features" is a Json array. Each element of the array is a Feature 
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
    
    (see [GeoJson FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3))
    """
    scalar GeoJsonFeatureCollection
    
    """
    A Geometry object represents points, curves, and surfaces in coordinate space.  Every Geometry object is a GeoJson 
    object no matter where it occurs in a GeoJson text.
    
    (See [GeoJson Geometry](https://tools.ietf.org/html/rfc7946#section-3.1))
    """
    scalar GeoJsonGeometryObject
    
    """
    A GeoJson object with type "GeometryCollection" is a Geometry object. A GeometryCollection has a member with the 
    name "geometries".  The value of "geometries" is an array.  Each element of this array is a GeoJson Geometry object.  
    It is possible for this array to be empty.
    
    (See [GeoJson GeometryCollection](https://tools.ietf.org/html/rfc7946#section-3.1.8))
    """
    scalar GeoJsonGeometryCollection
    
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
    
    (See [GeoJson LineString](https://tools.ietf.org/html/rfc7946#section-3.1.4))
    """
    scalar GeoJsonLineString
    
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
    
    (See [GeoJson MultiLineString](https://tools.ietf.org/html/rfc7946#section-3.1.5))
    """
    scalar GeoJsonMultiLineString
    
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
    
    (See [GeoJson MultiPoint](https://tools.ietf.org/html/rfc7946#section-3.1.3))
    """
    scalar GeoJsonMultiPoint
    
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
    
    (See: [GeoJson MultiPolygon](https://tools.ietf.org/html/rfc7946#section-3.1.7))
    """
    scalar GeoJsonMultiPolygon
    
    """
    For type "Point", the "coordinates" member is a single position.
    
    Example:
    \`\`\`
    {
      "type": "Point",
      "coordinates": [100.0, 0.0]
    }
    \`\`\`
    
    (See: [GeoJson Point](https://tools.ietf.org/html/rfc7946#section-3.1.2))
    """
    scalar GeoJsonPoint
    
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
    
    (See: [GeoJson Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6))
    """
    scalar GeoJsonPolygon
    
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
   
    (See: [GeoJson Position](https://tools.ietf.org/html/rfc7946#section-3.1.1))
    """
    scalar GeoJsonPosition
  `,

  // ===================================================================================================================
  // Resolvers
  // ===================================================================================================================

  resolvers: {

    /** Resolver for any GeoJson Bbox */
    GeoJsonBbox: YosGeoJsonScalar.get('Bbox'),

    /** Resolver for any GeoJson Feature */
    GeoJsonFeature: YosGeoJsonScalar.get('Feature'),

    /** Resolver for any GeoJson FeatureCollection */
    GeoJsonFeatureCollection: YosGeoJsonScalar.get('FeatureCollection'),

    /** Resolver for any GeoJson GeometryObject */
    GeoJsonGeometryObject: YosGeoJsonScalar.get('GeometryObject'),

    /** Resolver for any GeoJson GeometryCollection */
    GeoJsonGeometryCollection: YosGeoJsonScalar.get('GeometryCollection'),

    /** Resolver for any GeoJson LineString */
    GeoJsonLineString: YosGeoJsonScalar.get('LineString'),

    /** Resolver for any GeoJson MultiLineString */
    GeoJsonMultiLineString: YosGeoJsonScalar.get('MultiLineString'),

    /** Resolver for any GeoJson MultiPoint */
    GeoJsonMultiPoint: YosGeoJsonScalar.get('MultiPoint'),

    /** Resolver for any GeoJson MultiPolygon */
    GeoJsonMultiPolygon: YosGeoJsonScalar.get('MultiPolygon'),

    /** Resolver for any GeoJson Point */
    GeoJsonPoint: YosGeoJsonScalar.get('Point'),

    /** Resolver for any GeoJson Polygon */
    GeoJsonPolygon: YosGeoJsonScalar.get('Polygon'),

    /** Resolver for any GeoJson Position */
    GeoJsonPosition: YosGeoJsonScalar.get('Position')
  }
};
