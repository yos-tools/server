import { YosObject, YosStore } from '..';
import * as Fortune from '../definitions/fortune';

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
  id: Fortune.ID;


  // ===================================================================================================================
  // Static store methods
  // ===================================================================================================================

  /**
   * The `find` method retrieves record by type given IDs, querying options,
   * or both. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  public static async find<T extends YosModel>(this: new (...args: any[]) => T, ids?: Fortune.ID | Fortune.ID[], options?: Fortune.FindOptions, include?: Fortune.Include, meta?: object, item: T = new this()): Promise<Fortune.Response<T>> {
    const response = await YosStore.find((<typeof YosModel> item.constructor).yosRecordTypeName, ids, options, include, meta);
    return await (<any> item).processStoreResponse(response);
  }

  /**
   * The `create` method creates records by type given records to create. This
   * is a convenience method that wraps around the `request` method, see the
   * request `method` for documentation on its arguments.
   */
  public static async create<T extends YosModel>(this: new (...args: any[]) => T, records: object | object[], include?: Fortune.Include, meta?: object, item: T = new this()): Promise<Fortune.Response<T>> {
    records = await YosStore.prepareDataForStore(records);
    const response = await YosStore.create((<typeof YosModel> item.constructor).yosRecordTypeName, records, include, meta);
    return await (<any> item).processStoreResponse(response);
  }

  /**
   * The `update` method updates records by type given update objects. See the
   * [Adapter.update](#adapter-update) method for the format of the update
   * objects. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  public static async update<T extends YosModel>(this: new (...args: any[]) => T, updates: object | object[], include?: Fortune.Include, meta?: object, item: T = new this()): Promise<Fortune.Response<T>> {
    updates = await YosStore.prepareDataForStore(updates);
    const response = await YosStore.update((<typeof YosModel> this.constructor).yosRecordTypeName, updates, include, meta);
    return await (<any> item).processStoreResponse(response);
  }

  /**
   * The `delete` method deletes records by type given IDs (optional). This is a
   * convenience method that wraps around the `request` method, see the `request`
   * method for documentation on its arguments.
   */
  public static async delete<T extends YosModel>(this: new (...args: any[]) => T, ids?: Fortune.ID | Fortune.ID[], include?: Fortune.Include, meta?: object, item: T = new this()): Promise<Fortune.Response<T>> {
    const response = await YosStore.delete((<typeof YosModel> item.constructor).yosRecordTypeName, ids, include, meta);
    return await (<any> item).processStoreResponse(response);
  }


  // ===================================================================================================================
  // Static methods
  // ===================================================================================================================

  /**
   * Static map method
   */
  public static map<T extends YosModel>(this: new (...args: any[]) => T, data: any, item: T = new this()): T | Promise<T> {
    return (<any>item).map(data);
  }

  // ===================================================================================================================
  // Abstracts methods (to be implemented)
  // ===================================================================================================================

  /**
   * Map data into an object
   */
  public abstract map(data: object): this | Promise<this>;

  // ===================================================================================================================
  // Instance methods
  // ===================================================================================================================

  /**
   * Get data for API
   */
  public getDataForApi(): YosObject | Promise<YosObject> {
    return this;
  }

  /**
   * Get data for store
   */
  public getDataForStore(): YosObject | Promise<YosObject> {
    return this;
  }

  /**
   * Create or update current object
   *
   * If the object contains an ID, the object is updated in the store. If there is no ID, it will be created.
   */
  public save<T extends YosModel>(this: new (...args: any[]) => T): Promise<Fortune.Response<T>> {
    return (<any>this).id ? (<any>this).update() : (<any>this).create(this);
  }


  // ===================================================================================================================
  // Store methods
  // ===================================================================================================================

  /**
   * Updates the object in the store
   */
  public async update<T extends YosModel>(this: new (...args: any[]) => T, include?: Fortune.Include, meta?: object): Promise<Fortune.Response<T>> {
    const data = await YosStore.prepareDataForStore(this);
    const response = await YosStore.update((<typeof YosModel> this.constructor).yosRecordTypeName, data, include, meta);
    return await (<any> this).processStoreResponse(response);
  }

  /**
   * Deletes the object in the store
   */
  public async delete<T extends YosModel>(this: new (...args: any[]) => T, include?: Fortune.Include, meta?: object): Promise<Fortune.Response<T>> {
    const response = await YosStore.delete((<typeof YosModel> this.constructor).yosRecordTypeName, (<any>this).id, include, meta);
    return await (<any>YosModel).processStoreResponse(response);
  }

  /**
   * Creates a duplicate with new ID in the store
   */
  public static async duplicate<T extends YosModel>(this: new (...args: any[]) => T, include?: Fortune.Include, meta?: object): Promise<Fortune.Response<T>> {
    const data = await YosStore.prepareDataForStore(this);
    delete data.id;
    const response = await YosStore.create((<typeof YosModel> this.constructor).yosRecordTypeName, data, include, meta);
    return await (<any> this).processStoreResponse(response);
  }


  // ===================================================================================================================
  // Helper methods
  // ===================================================================================================================

  /**
   * Map records into model objects
   */
  public async processStoreResponse<T extends YosModel>(this: new (...args: any[]) => T, response: Fortune.Response): Promise<Fortune.Response<T>> {
    response.payload.records = await Promise.all(response.payload.records.map(async (record: any) => {

      // Set standard properties
      (<any>this).id = record.id;

      // Map record data via model map function
      return await (<any>this).map(record);
    }));
    return response;
  }
}
