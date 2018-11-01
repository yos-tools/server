import * as Fortune from 'fortune';
import * as _ from 'lodash';
import { YosHelper, YosStoreConfig } from '..';

/**
 * Static store
 */
export class YosStore {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /**
   * Fortune store
   */
  protected static store: Fortune;


  // ===================================================================================================================
  // Static class
  // ===================================================================================================================

  /**
   * Private constructor can not be called
   */
  private constructor() {}


  // ===================================================================================================================
  // Management methods
  // ===================================================================================================================

  /**
   * Record type definitions from all models of this type
   */
  protected static modelRecordTypeDefinitions: Fortune.RecordTypeDefinitions = {};

  /**
   * Hooks from all models of this type
   */
  protected static modelHooks: { [recordType: string]: Fortune.Hook } = {};

  /**
   * Init store
   */
  public static async initStore(
    store: YosStoreConfig | Fortune,
    integrateModelDataOnInit: boolean = true
  ): Promise<YosStore> {
    if (!YosStore.store) {
      store = YosStore.optimizeYosStoreConfig(store);
      if (integrateModelDataOnInit) {
        Object.assign(store.recordTypes, YosStore.modelRecordTypeDefinitions);
        Object.assign(store.options.hooks, YosStore.modelHooks)
      }
      YosStore.store =  new Fortune(store.recordTypes, store.options);
      await YosStore.store.connect();
      return;
    }
    await YosStore.assignStore(store);
  }

  /**
   * Init a model
   */
  public static setModelData(
    recordTypeName: string,
    definition: object,
    hook?: Fortune.Hook,
  ) {
    YosStore.modelRecordTypeDefinitions[recordTypeName] = definition;
    YosStore.modelHooks[recordTypeName] = hook;
  }

  /**
   * Get cloned model data (for a specific record)
   */
  public static getModelData(recordTypeName?: string): {
    recordTypeDefinitions: Fortune.RecordTypeDefinitions | object,
    hooks: Fortune.Hook | { [recordTypeName: string]: Fortune.Hook }
  } {

    // Get model data of specific record
    if (recordTypeName) {
      return _.cloneDeep({
        recordTypeDefinitions: YosStore.modelRecordTypeDefinitions[recordTypeName],
        hooks: YosStore.modelHooks[recordTypeName]
      });
    }

    // Get model data of all records
    return _.cloneDeep({recordTypeDefinitions: YosStore.modelRecordTypeDefinitions, hooks: YosStore.modelHooks});
  }

  /**
   * Optimize YosStoreConfig
   * @param store
   */
  public static optimizeYosStoreConfig(store: YosStoreConfig | Fortune): YosStoreConfig | Fortune {
    store = _.cloneDeep(store);
    store.recordTypes = store && store.recordTypes ? store.recordTypes : {};
    store.options = store && store.options ? store.options : {hooks: {}};
    if (store && store.hooks) {
      Object.assign(store.options.hooks, store.hooks);
    }
    return store;
  }

  /**
   * Assign recordTypes, hooks and options to the store
   * @param store
   */
  public static async assignStore(store: YosStoreConfig | Fortune): Promise<void> {

    // Check parameter
    if (!store) {
      return;
    }

    // Check store
    if (!YosStore.store) {
      if (store instanceof Fortune || !_.isEmpty(store.recordTypes) && !_.isEmpty(store.options)) {
        await YosStore.initStore(store);
      } else {
        throw new Error('Store is not initialized yet. Please call YosStore.iniStore before.');
      }
    }

    // Optimize store configuration
    store = YosStore.optimizeYosStoreConfig(store);

    // Disconnect store
    await YosStore.store.disconnect();

    // Merge record types
    YosHelper.specialMerge(YosStore.store.recordTypes, store.recordTypes);

    // Assign hooks
    Object.assign(YosStore.store.hooks, store.options.hooks);

    // Assign options
    if (store.options && store.options.settings) {
      Object.assign(store.options.settings, YosStore.store.options.settings, store.options.settings ? store.options.settings : {});
    }
    Object.assign(YosStore.store.options, store.options);

    // Set options hooks (necessary if they have been replaced by the allocation of store.options)
    YosStore.store.options.hooks = YosStore.store.hooks;

    // Connect store
    // (Reconnecting isn't really necessary, just advised for some adapters that may need setup like Postgres)
    await YosStore.store.connect();
  }

  /**
   * Prepare object for store
   */
  public static prepareDataForStore(data: any | any[]): Promise<any> {
    return YosHelper.callDeepObjectFunction(_.cloneDeep(data), 'getDataForStore')
  }

  // ===================================================================================================================
  // Store communication methods
  // ===================================================================================================================

  /**
   * This is the primary method for initiating a request.
   * The resolved response object should always be an instance of a response
   * type.
   */
  public static request(options: Fortune.RequestOptions): Promise<Fortune.Response> {
    return YosStore.store.request(options);
  }

  /**
   * The `find` method retrieves record by type given IDs, querying options,
   * or both. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  public static find(type: string, ids?: Fortune.ID | Fortune.ID[], options?: Fortune.FindOptions, include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return YosStore.store.find(type, ids, options, include, meta);
  }

  /**
   * The `create` method creates records by type given records to create. This
   * is a convenience method that wraps around the `request` method, see the
   * request `method` for documentation on its arguments.
   */
  public static create(type: string, records: object | object[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return YosStore.store.create(type, records, include, meta);
  }

  /**
   * The `update` method updates records by type given update objects. See the
   * [Adapter.update](#adapter-update) method for the format of the update
   * objects. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  public static update(type: string, updates: object | object[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return YosStore.store.update(type, updates, include, meta);
  }

  /**
   * The `delete` method deletes records by type given IDs (optional). This is a
   * convenience method that wraps around the `request` method, see the `request`
   * method for documentation on its arguments.
   */
  public static delete(type: string, ids?: Fortune.ID | Fortune.ID[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return YosStore.store.delete(type, ids, include, meta);
  }
}
