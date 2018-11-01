import { YosModel, YosRef, YosUser } from '..';
import { prop, storeInput, storeOutput } from '../decorators/yos-model.decorator';
import * as Fortune from '../definitions/fortune';

/**
 * Meta data for persistent objects
 */
export abstract class YosPersistentModel extends YosModel {

  // ===================================================================================================================
  // Instance properties
  // ===================================================================================================================

  /**
   * Accessed date
   *
   * Is not stored
   * Will be set by store output hook
   */
  accessedAt: Date;

  /**
   * Created date
   *
   * Will be set by store input hook
   */
  @prop({type: Date})
  createdAt: Date;

  /**
   * Created by
   *
   * Must be set in model or controller
   */
  @prop({type: 'user'})
  createdBy: YosRef<YosUser>;

  /**
   * Updated date
   *
   * Will be set by store input hook
   */
  @prop({type: Date})
  updatedAt: Date;

  /**
   * Updated by
   *
   * Must be set in model or controller
   */
  @prop({type: 'user'})
  updatedBy: YosRef<YosUser>;


  // ===================================================================================================================
  // Hooks
  // ===================================================================================================================

  /**
   * Store input hook
   */
  @storeInput()
  public storeInput(context: any, record: any, update?: any): object {

    switch (context.request.method) {

      // If it's a create request, return the record.
      case 'create':
        record.createdAt = new Date();
        return record;

      // If it's an update request, return the update.
      case 'update':
        update.updatedAt = new Date();
        return update;

      // If it's a delete request, the return value doesn't matter.
      case 'delete':
        return null;
    }
  }

  /**
   * Store output hook
   */
  @storeOutput()
  public storeOutput(context: any, record: any) {
    record.accessedAt = record.accessedAt ? record.accessedAt : new Date();
    return record;
  }

  // ===================================================================================================================
  // Helper methods
  // ===================================================================================================================

  /**
   * Map records into model objects
   * (overwrites processStoreResponse of YosModel)
   */
  public async processStoreResponse<T extends YosModel>(this: new (...args: any[]) => T, response: Fortune.Response): Promise<Fortune.Response<T>> {
    response.payload.records = await Promise.all(response.payload.records.map(async (record: any) => {

      // Set standard properties
      (<any>this).id = record.id;
      (<any>this).accessedAt= record.accessedAt;
      (<any>this).createdAt = record.createdAt;
      (<any>this).createdBy = record.createdBy;
      (<any>this).updatedAt = record.updatedAt;
      (<any>this).updatedBy = record.updatedBy;

      // Map record data via model map function
      return await (<any>this).map(record)
    }));
    return response;
  }
}
