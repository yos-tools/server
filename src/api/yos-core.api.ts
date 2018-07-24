import { YosSchemaDefinition } from '..';
import { YosAnyScalar } from '../scalars/yos-any.scalar';

// Init
const packageJson = require('../../package.json');
const env: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const name = packageJson.name;
const version = packageJson.version;


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
    # Scalars
    # Custom scalars see https://www.apollographql.com/docs/graphql-tools/scalars.html
    # ==================================================================================================================
    
    "Scalar for any (JSON) value"
    scalar Any
    
    
    # ==================================================================================================================
    # Types
    # ==================================================================================================================
  
    "Information about the API"
    type API {
     
      "Environment of the API"
      env: String
      
      "Name of the API"
      name: String
      
      "Current version of API"
      version: String
    }

    # ==================================================================================================================
    # Queries
    # ==================================================================================================================

    type Query {
    
      "Get information about the API"
      api: API
    }
  `,

  resolvers: {
    Any: YosAnyScalar,
    Query: {
      api: () => {
        return {
          env: env,
          name: name,
          version: version
        };
      }
    }
  }
};
