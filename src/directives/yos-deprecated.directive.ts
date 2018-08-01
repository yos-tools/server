import { GraphQLEnumValue, GraphQLField } from 'graphql';
import { SchemaDirectiveVisitor } from "graphql-tools";

/**
 * Directive to mark a field or an enum as deprecated
 */
export class YosDeprecatedDirective extends SchemaDirectiveVisitor {

  /**
   * Handling for field
   * @param field
   */
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    field.isDeprecated = true;
    field.deprecationReason = this.args.reason;
  }

  /**
   * Handling for enum
   * @param value
   */
  public visitEnumValue(value: GraphQLEnumValue) {
    value.isDeprecated = true;
    value.deprecationReason = this.args.reason;
  }
}
