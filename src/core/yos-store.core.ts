import * as Fortune from 'fortune';
import * as _ from 'lodash';
import { YosStoreConfig } from '..';

/**
 * Store (Singleton)
 */
export class YosStore {

  // ===================================================================================================================
  // Static properties
  // ===================================================================================================================

  /**
   * Singleton instance of YosStore
   */
  protected static instance: YosStore;


  // ===================================================================================================================
  // Instance properties
  // ===================================================================================================================

  /**
   * Fortune store
   */
  protected store: Fortune;

  // ===================================================================================================================
  // Instance properties
  // ===================================================================================================================

  /**
   * Private constructor for YosStore Singleton
   */
  protected constructor(store: YosStoreConfig | Fortune) {
    YosStore.optimizeYosStoreConfig(store);
    this.store =  new Fortune(store.recordTypes, store.options);
  }

  // ===================================================================================================================
  // Static methods
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
   * Get instance
   */
  public static async getInstance(
    store: YosStoreConfig | Fortune,
    integrateModelDataOnInit: boolean = true
  ): Promise<YosStore> {
    if (!YosStore.instance) {
      YosStore.instance = new YosStore(store);
      await YosStore.instance.store.connect();
      if (integrateModelDataOnInit) {
        await YosStore.instance.assignStore({
          recordTypes: YosStore.modelRecordTypeDefinitions,
          hooks: YosStore.modelHooks
        });
      }
      return YosStore.instance;
    }
    return YosStore.instance.assignStore(store);
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
  public static optimizeYosStoreConfig(store: YosStoreConfig) {
    store.recordTypes = store && store.recordTypes ? store.recordTypes : {};
    store.options = store && store.options ? store.options : {hooks: {}};
    if (store && store.hooks) {
      Object.assign(store.options.hooks, store.hooks);
    }
    return store;
  }


  // ===================================================================================================================
  // Instance methods
  // ===================================================================================================================

  /**
   * Assign recordTypes, hooks and options to the store
   * @param store
   */
  public async assignStore(store: YosStoreConfig | Fortune): Promise<YosStore> {

    if (!store) {
      return this;
    }

    // Optimize store configuration
    YosStore.optimizeYosStoreConfig(store);

    // Disconnect store
    await this.store.disconnect();

    // Assign record types
    Object.assign(this.store.recordTypes, store.recordTypes);

    // Assign hooks
    Object.assign(this.store.hooks, store.options.hooks);

    // Assign options
    if (store.options && store.options.settings) {
      Object.assign(store.options.settings, this.store.options.settings, store.options.settings ? store.options.settings : {});
    }
    Object.assign(this.store.options, store.options);

    // Set options hooks (necessary if they have been replaced by the allocation of store.options)
    this.store.options.hooks = this.store.hooks;

    // Connect store
    // (Reconnecting isn't really necessary, just advised for some adapters that may need setup like Postgres)
    await this.store.connect();

    // Return assigned store
    return this;
  }

  /**
   * This is the primary method for initiating a request.
   * The resolved response object should always be an instance of a response
   * type.
   */
  request(options: Fortune.RequestOptions): Promise<Fortune.Response> {
    return this.store.request(options);
  }

  /**
   * The `find` method retrieves record by type given IDs, querying options,
   * or both. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  find(type: string, ids?: Fortune.ID | Fortune.ID[], options?: Fortune.Options, include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return this.store.find(type, ids, options, include, meta);
  }

  /**
   * The `create` method creates records by type given records to create. This
   * is a convenience method that wraps around the `request` method, see the
   * request `method` for documentation on its arguments.
   */
  create(type: string, records: object | object[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return this.store.create(type, records, include, meta);
  }

  /**
   * The `update` method updates records by type given update objects. See the
   * [Adapter.update](#adapter-update) method for the format of the update
   * objects. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  update(type: string, updates: object | object[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return this.store.update(type, updates, include, meta);
  }

  /**
   * The `delete` method deletes records by type given IDs (optional). This is a
   * convenience method that wraps around the `request` method, see the `request`
   * method for documentation on its arguments.
   */
  delete(type: string, ids?: Fortune.ID | Fortune.ID[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response> {
    return this.store.delete(type, ids, include, meta);
  }
}
