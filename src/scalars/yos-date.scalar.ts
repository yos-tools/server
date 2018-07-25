import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';
import { ValueNode } from 'graphql/language/ast';
import * as validator from 'validator';


/**
 * Convert value to a date object
 * @param value
 * @returns {any}
 */
const toDate = (value: any) => {

  // Check for date
  if (value instanceof Date) {
    return value;
  }

  // Convert value to string
  if (value.toString) {
    value = value.toString;
  }

  // Convert value to date
  const date = validator.toDate(value);
  if (!date) {
    const message = `Date can't represent non-date value: ${value}`;
    throw new TypeError(message);
  }

  // Return date
  return date;
};

/**
 * Date scalar type for GraphQL
 * Inspired by https://github.com/adriano-di-giovanni/graphql-scalars/blob/master/src/GraphQLDate.js
 *
 * @type {GraphQLScalarType}
 */
export const YosDateScalar = new GraphQLScalarType({

  /**
   * Name of the scalar
   */
  name: 'Date',

  /**
   * Description of the scalar
   */
  description: 'Javascript Date Object',

  /**
   * Parse value from the client
   * @param value
   * @returns {any}
   */
  parseValue(value: any): any {
    return toDate(value);
  },

  /**
   * Serialize value to the client
   * @param value
   * @returns {any}
   */
  serialize(value: any): any {
    return toDate(value).toISOString();
  },

  /**
   * Parse literal
   * @param valueNode
   * @returns {any}
   */
  parseLiteral(valueNode: ValueNode): any {

    // Init
    const {kind, value} = <any> valueNode;
    let str: string;

    // Check date
    if (value instanceof Date) {
      return value;
    }

    // Convert value to string
    switch (kind) {
      case Kind.INT:
      case Kind.FLOAT:
        str = '' + value;
        break;
      case Kind.STRING:
        str = value;
        break;
    }

    // Convert string to date
    const date = validator.toDate(str);
    if (!date) {
      throw new GraphQLError(`Expected date value but got: ${value}`, [valueNode]);
    }

    // Return date
    return date;
  }
});
