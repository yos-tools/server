import * as Fortune from 'fortune';
import * as _ from 'lodash';

export class YosModel {

  /**
   * Record type definitions from all models of this type
   */
  private static recordTypeDefinitions: Fortune.RecordTypeDefinitions = {};

  /**
   * Hooks from all models of this type
   */
  private static hooks: { [recordType: string]: Fortune.Hook } = {};

  /**
   * Init a model
   */
  public static initModel<T extends YosModel>(
    this: new (...args: any[]) => T,
    definition: object,
    hook?: Fortune.Hook,
    recordTypeName: string = _.camelCase(this.constructor.name)
  ) {
    YosModel.recordTypeDefinitions[recordTypeName] = definition;
    YosModel.hooks[recordTypeName] = hook;
  }

  /**
   * Get cloned model data (for a specific record)
   */
  public static getModelData(recordTypeName: string = _.camelCase(this.constructor.name)): {
    recordTypeDefinitions: Fortune.RecordTypeDefinitions | object,
    hooks: Fortune.Hook | { [recordTypeName: string]: Fortune.Hook }
  } {

    // Get model data of specific record
    if (recordTypeName) {
      return _.cloneDeep({
        recordTypeDefinitions: YosModel.recordTypeDefinitions[recordTypeName],
        hooks: YosModel.hooks[recordTypeName]
      });
    }

    // Get model data of all records
    return _.cloneDeep({recordTypeDefinitions: YosModel.recordTypeDefinitions, hooks: YosModel.hooks});
  }
}
