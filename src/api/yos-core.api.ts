import {
  NegativeFloat,
  NegativeInt,
  NonNegativeFloat,
  NonNegativeInt,
  NonPositiveFloat,
  NonPositiveInt,
  PhoneNumber,
  PositiveFloat,
  PositiveInt,
  PostalCode,
  URL
} from '@okgrow/graphql-scalars';
import { YosCoreController, YosResolver, YosSchemaDefinition } from '..';
import { YosDeprecatedDirective } from '../directives/yos-deprecated.directive';
import { YosAnyScalar } from '../scalars/yos-any.scalar';
import { YosDateScalar } from '../scalars/yos-date.scalar';
import { YosEmailAddressScalar } from '../scalars/yos-email-address.scalar';


/**
 * Core API of yos-server
 * @type {YosSchemaDefinition}
 */
export const YosCoreApi: YosSchemaDefinition = {

  // ===================================================================================================================
  // Type definitions
  // ===================================================================================================================

  typeDefs: `
  
    # ==================================================================================================================
    # Directives
    # ==================================================================================================================
    
    "Marks a field or an enum as deprecated (https://www.apollographql.com/docs/graphql-tools/schema-directives.html)"
    directive @deprecated(
      "Allows to specify a reason for the tag as deprecated"
      reason: String = "No longer supported"
    ) on FIELD_DEFINITION | ENUM_VALUE
  
    # ==================================================================================================================
    # Enums
    # ==================================================================================================================
  
    "[Comparison Query Operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/)"
    enum ComparisonOperator {
     
      "Matches values that are equal to a specified value"
      EQ
      
      "Matches values that are greater than a specified value"
      GT
      
      "Matches values that are greater than or equal to a specified value"
      GTE
      
      "Matches any of the values specified in an array"
      IN
      
      "Matches values that are less than a specified value"
      LT
      
      "Matches values that are less than or equal to a specified value"
      LTE
      
      "Matches all values that are not equal to a specified value"
      NE
      
      "Matches none of the values specified in an array"
      NIN
      
      """
      Provides regular expression capabilities for pattern matching strings 
      (see [$regex](https://docs.mongodb.com/manual/reference/operator/query/regex/))
      """
      REGEX
    }
    
    "[Sort order](https://docs.mongodb.com/manual/reference/method/cursor.sort/#ascending-descending-sort)"
    enum SortOrder {
      
      "Ascending sort order"
      ASC
      
      "Descending sort order"
      DESC
    }
    
    # ==================================================================================================================
    # Inputs
    # ==================================================================================================================
    
    "Filter for values"
    input Filter {
    
      "[Negate operator](https://docs.mongodb.com/manual/reference/operator/query/not/)"    
      not: Boolean
      
      "[Comparison operator](https://docs.mongodb.com/manual/reference/operator/query-comparison/)"
      operator: ComparisonOperator!
      
      "[Options](https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_options) for [REGEX](https://docs.mongodb.com/manual/reference/operator/query/regex/) operator"
      options: [String!]
      
      "Value for the filter"
      value: Any!
    }
    
    "Pagination"
    input Pagination {
      
      """
      Limits the number of matching items 
      (see [$limit](https://docs.mongodb.com/manual/reference/operator/aggregation/limit/))
      """
      limit: Int
      
      """
      Skips over the specified number of matching items
      (see [$skip](https://docs.mongodb.com/manual/reference/operator/aggregation/skip/))
      """
      skip: Int
      
      """
      Specifies the order in which the query returns matching items
      (see [$sort](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/)).
      
      If several sorts are specified, they are processed one after the other. The subsequent elements sort only the 
      elements with the same sort rank, i.e. the elements that could have been returned in a different valid sequence.
      """
      sort: [Sort!]
    }
    
    """
    Sort specifies the order in which queries return matching items
    (see [$sort](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/))
    """
    input Sort {
      "Field to be sorted"
      field: String
      
      "The sort order in which the items are to be sorted: ASC or DESC"
      order: SortOrder
    }

    # ==================================================================================================================
    # Scalars
    # Custom scalars see https://www.apollographql.com/docs/graphql-tools/scalars.html
    # ==================================================================================================================
    
    "Scalar for any (JSON) value"
    scalar Any
    
    """
    Scalar for dates.
    String will be converted into a JavaScript date object 
    """
    scalar Date
    
    "Scalar for EmailAddresses"
    scalar EmailAddress
    
    "Scalar for floats that will have a value less than 0"
    scalar NegativeFloat

    "Scalar for integers that will have a value less than 0"
    scalar NegativeInt
    
    "Scalar for floats that will have a value of 0 or more"
    scalar NonNegativeFloat
    
    "Scalar for integers that will have a value of 0 or more"
    scalar NonNegativeInt
    
    "Scalar for floats that will have a value of 0 or less"
    scalar NonPositiveFloat
    
    "Scalar for integers that will have a value of 0 or less"
    scalar NonPositiveInt
    
    """ 
    Scalar for telephone numbers according to the standard E.164 format as specified in 
    [E.164 specification](https://en.wikipedia.org/wiki/E.164). Basically this is +17895551234. The very powerful 
    [libphonenumber library](https://github.com/googlei18n/libphonenumber) is available to take that format, parse 
    and display it in whatever display format you want. It can also be used to parse user input and get the 
    E.164 format to pass into a schema."
    """
    scalar PhoneNumber
    
    "Scalar for floats that will have a value greater than 0"
    scalar PositiveFloat
   
    "Scalar for integers that will have a value greater than 0"
    scalar PositiveInt
    
    "Scalar for postal code (zip code)"
    scalar PostalCode
    
    "Scalar for the standard URL format as specified in [RFC3986](https://www.ietf.org/rfc/rfc3986.txt)"
    scalar URL

    
    # ==================================================================================================================
    # Types
    # ==================================================================================================================
  
    "Information about the API"
    type API {
     
      "Environment of the API"
      environment: String!
      
      "Name of the API"
      name: String!
      
      "Current version of API"
      version: String!
      
      "Current Position"
      ipLookup: Any @deprecated(reason: "Use \`newField\`.")
    }


    # ==================================================================================================================
    # Queries
    # ==================================================================================================================

    type Query {
    
      "Information about the API"
      api: API
    }
  `,


  // ===================================================================================================================
  // Resolvers
  // ===================================================================================================================

  resolvers: {

    /** Resolver for any (JSON) */
    Any: YosAnyScalar,

    /** Resolver for dates */
    Date: YosDateScalar,

    /** Resolver for email addresses */
    EmailAddress: YosEmailAddressScalar,

    /** Resolver for negative float */
    NegativeFloat: NegativeFloat,

    /** Resolver for negative integer */
    NegativeInt: NegativeInt,

    /** Resolver for none negative float */
    NonNegativeFloat: NonNegativeFloat,

    /** Resolver for none negative integer */
    NonNegativeInt: NonNegativeInt,

    /** Resolver for none negative float */
    NonPositiveFloat: NonPositiveFloat,

    /** Resolver for none negative integer */
    NonPositiveInt: NonPositiveInt,

    /** Resolver for phone number */
    PhoneNumber: PhoneNumber,

    /** Resolver for positive float */
    PositiveFloat: PositiveFloat,

    /** Resolver for positive integer */
    PositiveInt: PositiveInt,

    /** Resolver for postal code (zip code) */
    PostalCode: PostalCode,

    /** Resolver for URL */
    URL: URL,

    /** Resolver for queries */
    Query: {
      api: (...params: any[]) => YosResolver.graphQL(YosCoreController.api, params)
    }
  },

  // ===================================================================================================================
  // Directives
  // ===================================================================================================================

  schemaDirectives: {
    deprecated: YosDeprecatedDirective
  }
};
