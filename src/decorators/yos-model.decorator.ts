import * as Fortune from 'fortune';
import * as _ from 'lodash';
import { YosStore } from '..';

/**
 * Container for model data
 */
const modelData: { [model: string]: { definition: object, hook: Fortune.Hook } } = {};

/**
 * Get (new) model
 */
function getModel(model: string) {
  if (!modelData[model]) {
    modelData[model] = {
      definition: {},
      hook: [null, null]
    };
  }
  return modelData[model];
}

/**
 * Input hook decorator
 */
export function storeInput(): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    getModel(target.constructor.name).hook[0] = descriptor.value;
  };
}

/**
 * Model decorator
 */
export function model(options?: { recordTypeName?: string }): Function {
  return (constructor: Function) => {
    const recordTypeName = options && options.recordTypeName ? options.recordTypeName : _.camelCase(constructor.name);
    YosStore.setModelData(
      recordTypeName,
      _.get(modelData[constructor.name], 'definition'),
      _.get(modelData[constructor.name], 'hook')
    );
    Object.defineProperty(constructor, 'yosRecordTypeName', {
      writable: false,
      value: recordTypeName
    });
  };
}

/**
 * Output hook decorator
 */
export function storeOutput(): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    getModel(target.constructor.name).hook[1] = descriptor.value;
  };
}

/**
 * Property decorator
 */
export function prop(options: { type: any }): Function {
  return (target: any, key: string) => {
    const entry: any = {};
    entry[key] = options.type;
    Object.assign(getModel(target.constructor.name).definition, entry);
  };
}
