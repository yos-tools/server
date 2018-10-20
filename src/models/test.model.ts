import { model, prop, storeInput, storeOutput, YosModel } from '..';

@model({recordTypeName: 'testModel'})
export class Test extends YosModel {

  @prop({type: String})
  xxx: String = 'bla';

  @storeInput()
  storeInput(context: any, record: any, update?: any): object {
    switch (context.request.method) {
      // If it's a create request, return the record.
      case 'create':
        return record;

      // If it's an update request, return the update.
      case 'update':
        return update;

      // If it's a delete request, the return value doesn't matter.
      case 'delete':
        return null;
    }
  }

  @storeOutput()
  public storeOutput(context: any, record: any) {
    record.accessedAt = new Date();
    return record;
  }
}
