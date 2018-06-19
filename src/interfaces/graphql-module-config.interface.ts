import { Config } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { YosServerModuleConfig } from './yos-server-module-config.interface';

export interface GraphqlModuleConfig extends YosServerModuleConfig {

  // Set own apollo server
  // (see https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html)
  apolloSever: ApolloServer,

  // Configuration for new apollo server
  // (see https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html#constructor-options-lt-ApolloServer-gt)
  apolloConfig: Config,

  // Enable playground
  // true => enable playground on graphql url
  // false => disable playground
  playground: true,

  // Enable subscriptions
  // string => enable subscriptions on this url endpoint
  // true => enable subscriptions on '/subscriptions'
  // false => disable subscriptions
  subscriptions: 'subscriptions',

  // URL endpoint
  url: 'graphql'
}
