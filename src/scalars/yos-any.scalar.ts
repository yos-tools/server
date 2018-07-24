import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

/**
 * Any scalar type for GraphQL
 * See https://github.com/taion/graphql-type-json
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
   * Serialize
   * @param value
   * @returns {any}
   */
  serialize(value: any): any {
    return value;
  },

  /**
   * Parse value
   * @param value
   * @returns {any}
   */
  parseValue(value: any): any {
    return value;
  },

  /**
   * Parse literal
   * @param ast
   * @param variables
   * @returns {any}
   */
  parseLiteral(ast, variables) {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT: {
        const value = Object.create(null);
        ast.fields.forEach(field => {
          value[field.name.value] = this.parseLiteral(field.value, variables);
        });

        return value;
      }
      case Kind.LIST:
        return ast.values.map(n => this.parseLiteral(n, variables));
      case Kind.NULL:
        return null;
      case Kind.VARIABLE: {
        const name = ast.name.value;
        return variables ? variables[name] : undefined;
      }
      default:
        return undefined;
    }
  }
});
