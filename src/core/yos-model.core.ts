import * as Fortune from '../definitions/fortune';
import { YosStore } from '..';

/**
 * Abstract model
 */
export abstract class YosModel {

  // ===================================================================================================================
  // Static properties
  // ===================================================================================================================

  /**
   * Record type name for store
   *
   * Set by decorator during the initialization of the model
   * (see YosModelDecorator model)
   */
  public static readonly yosRecordTypeName: string;


  // ===================================================================================================================
  // Instance properties
  // ===================================================================================================================

  /**
   * ID of the instance
   */
  id: string;


  // ===================================================================================================================
  // Instance methods
  // ===================================================================================================================

  /**
   * Get data for store
   */
  getDataForStore() {
    return this;
  }

  /**
   * Create or update current object
   *
   * If the object contains an ID, the object is updated in the store. If there is no ID, it will be created.
   */
  save<T extends YosModel>(this: new (...args: any[]) => T): Promise<Fortune.Response> {
    const func = (<any>this).id ? (<any>this).update : (<any>this).create;
    const data = typeof (<any>this).getDataForStore === 'function' ? (<any>this).getDataForStore() : this;
    return func(data);
  }


  // ===================================================================================================================
  // Store instance methods
  // ===================================================================================================================

  /**
   * The `find` method retrieves record by type given IDs, querying options,
   * or both. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  find<T extends YosModel>(this: new (...args: any[]) => T, ids?: Fortune.ID | Fortune.ID[], options?: Fortune.FindOptions, include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return YosStore.find((<typeof YosModel> this.constructor).yosRecordTypeName, ids, options, include, meta);
  }

  /**
   * The `create` method creates records by type given records to create. This
   * is a convenience method that wraps around the `request` method, see the
   * request `method` for documentation on its arguments.
   */
  create<T extends YosModel>(this: new (...args: any[]) => T, records: object | object[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return YosStore.create((<typeof YosModel> this.constructor).yosRecordTypeName, records, include, meta);
  }

  /**
   * The `update` method updates records by type given update objects. See the
   * [Adapter.update](#adapter-update) method for the format of the update
   * objects. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  update<T extends YosModel>(this: new (...args: any[]) => T, updates: object | object[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return YosStore.update((<typeof YosModel> this.constructor).yosRecordTypeName, updates, include, meta);
  }

  /**
   * The `delete` method deletes records by type given IDs (optional). This is a
   * convenience method that wraps around the `request` method, see the `request`
   * method for documentation on its arguments.
   */
  delete<T extends YosModel>(this: new (...args: any[]) => T, ids?: Fortune.ID | Fortune.ID[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return YosStore.delete((<typeof YosModel> this.constructor).yosRecordTypeName, ids, include, meta);
  }
}
