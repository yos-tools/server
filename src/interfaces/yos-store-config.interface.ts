import * as Fortune from '../definitions/fortune';

/**
 * YosStore configuration
 */
export interface YosStoreConfig {
  recordTypes?: Fortune.RecordTypeDefinitions,
  hooks?: Fortune.Hooks,
  options?: Fortune.Options
}
