// Type definitions for @okgrow/graphql-scalars
// Project: https://www.npmjs.com/package/@okgrow/graphql-scalars
// Definitions by: Kai Haase <https://github.com/yostools>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module '@okgrow/graphql-scalars' {

  import { GraphQLScalarType } from 'graphql/type/definition';

  export const DateTime: GraphQLScalarType;
  export const EmailAddress: GraphQLScalarType;
  export const NegativeFloat: GraphQLScalarType;
  export const NegativeInt: GraphQLScalarType;
  export const NonNegativeFloat: GraphQLScalarType;
  export const NonNegativeInt: GraphQLScalarType;
  export const NonPositiveFloat: GraphQLScalarType;
  export const NonPositiveInt: GraphQLScalarType;
  export const PhoneNumber: GraphQLScalarType;
  export const PositiveFloat: GraphQLScalarType;
  export const PositiveInt: GraphQLScalarType;
  export const PostalCode: GraphQLScalarType;
  export const URL: GraphQLScalarType;
}

