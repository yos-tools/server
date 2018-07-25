import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { ValueNode } from 'graphql/language/ast';
import Maybe from 'graphql/tsutils/Maybe';

/**
 * Any scalar type for GraphQL
 * Inspired by https://github.com/taion/graphql-type-json
 *
 * @type {GraphQLScalarType}
 */
export const YosAnyScalar = new GraphQLScalarType({

  /**
   * Name of the scalar
   */
  name: 'Any',

  /**
   * Description of the scalar
   */
  description: 'The `Any` scalar represents JSON values as specified by ' +
  '[ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',

  /**
   * Parse value from the client
   * @param value
   * @returns {any}
   */
  parseValue(value: any): any {
    return value;
  },

  /**
   * Serialize value to the client
   * @param value
   * @returns {any}
   */
  serialize(value: any): any {
    return value;
  },

  /**
   * Parse literal
   * @param valueNode
   * @param variables
   * @returns {any}
   */
  parseLiteral(valueNode: ValueNode, variables?: Maybe<{ [key: string]: any }>): any {
    switch (valueNode.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return valueNode.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(valueNode.value);
      case Kind.OBJECT: {
        const value = Object.create(null);
        valueNode.fields.forEach(field => {
          value[field.name.value] = this.parseLiteral(field.value, variables);
        });
        return value;
      }
      case Kind.LIST:
        return valueNode.values.map(n => this.parseLiteral(n, variables));
      case Kind.NULL:
        return null;
      case Kind.VARIABLE: {
        const name = valueNode.name.value;
        return variables ? variables[name] : undefined;
      }
      default:
        return undefined;
    }
  }
});
