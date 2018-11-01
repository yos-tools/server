import { User, YosModel } from '..';
import { prop, storeInput, storeOutput } from '../decorators/yos-model.decorator';

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
  createdBy: User;

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
  updatedBy: User;


  // ===================================================================================================================
  // Hooks
  // ===================================================================================================================

  /**
   * Store input hook
   */
  @storeInput()
  storeInput(context: any, record: any, update?: any): object {

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
}
