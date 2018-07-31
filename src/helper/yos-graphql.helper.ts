import { Kind, ValueNode } from 'graphql';
import Maybe from 'graphql/tsutils/Maybe';
import { YosObject } from '..';

/**
 * Helper for GraphQL
 */
export class YosGraphQL {

  /**
   * Parse literal
   * @param valueNode
   * @param variables
   * @returns {any}
   */
  public static parseLiteral(valueNode: ValueNode, variables?: Maybe<YosObject>): any {
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
          value[field.name.value] = YosGraphQL.parseLiteral(field.value, variables);
        });
        return value;
      }
      case Kind.LIST:
        return valueNode.values.map(n => YosGraphQL.parseLiteral(n, variables));
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
}
