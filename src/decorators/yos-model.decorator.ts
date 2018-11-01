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

/**
 * Model decorator
 */
export function model(options?: { recordTypeName?: string }): Function {
  return (constructor: Function) => {

    // Get record type name
    const recordTypeName = options && options.recordTypeName ? options.recordTypeName : _.camelCase(constructor.name);

    // Assign with properties from parents
    let parent = Object.getPrototypeOf(constructor);
    while (parent.name !== 'YosModel' && parent.name !== 'Object') {
      const currentDefinition = getModel(constructor.name).definition;
      Object.assign(currentDefinition, getModel(parent.name).definition, currentDefinition);
      parent = Object.getPrototypeOf(parent);
    }

    // Use parent input and / or output hook if there are no own hooks
    const ownHook = _.get(modelData[constructor.name], 'hook');
    if(!ownHook[0] || !ownHook[1]) {
      parent = Object.getPrototypeOf(constructor);
      if (parent.name !== 'YosModel' && parent.name !== 'Object') {
        const parentData = getModel(parent.name);
        if (parentData) {
          [0,1].forEach((pos) => {
            if (!ownHook[pos]) {
              ownHook[pos] = parentData.hook[pos];
            }
          });
        }
      }
    }

    // Set model data
    YosStore.setModelData(
      recordTypeName,
      _.get(modelData[constructor.name], 'definition'),
      _.get(modelData[constructor.name], 'hook')
    );

    // Set yosRecordTypeName
    Object.defineProperty(constructor, 'yosRecordTypeName', {
      writable: false,
      value: recordTypeName
    });
  };
}
