// Type definitions for fortune
// Project: https://www.npmjs.com/package/fortune
// Definitions by: Kai Haase <https://github.com/yostools>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


// =====================================================================================================================
// External definitions
// =====================================================================================================================

/**
 * Fortune extends EventLite
 */
import EventLite = require('event-lite');


// =====================================================================================================================
// Export main class
// =====================================================================================================================

export = Fortune;

/**
 * Fortune
 *
 * See http://fortune.js.org/api/#fortune
 */
declare class Fortune extends EventLite {

  // ===================================================================================================================
  // Static properties
  // ===================================================================================================================

  /**
   * Included adapters, defaults to memory adapter
   */
  static adapters: { [adapter: string]: Fortune.Adapter };

  /**
   * Custom error types, useful for throwing errors in I/O hooks
   */
  static errors: { [error: string]: Error };

  /**
   * A hash that maps to string constants. Available are: find, create, update, and delete
   */
  static methods: { [method: string]: Fortune.Method | string };

  /**
   * Names for events on the Fortune instance. Available are: change, sync, connect, disconnect, failure
   */
  static events: { [event: string]: Fortune.Event | string };

  /**
   * A function which accepts the arguments (id, language, data).
   * It has properties keyed by two-letter language codes, which by default includes only en.
   */
  static message: Fortune.Message;

  /**
   * Assign this to set the Promise implementation that Fortune will use.
   */
  static Promise: object;


  // ===================================================================================================================
  // Store properties
  // ===================================================================================================================

  /**
   * Singleton instance of used adapter
   */
  adapter: Fortune.Adapter;

  /**
   * Connection status
   * 0 = not started, 1 = started, 2 = done
   */
  connectionStatus: number;

  /**
   * Flows
   */
  flows: Function[];

  /**
   * Input and output hooks
   */
  hooks: Fortune.Hooks;

  /**
   * Messages
   */
  message: Fortune.Message;

  /**
   * Options
   */
  options: Fortune.Options;

  /**
   * Record type definitions
   */
  recordTypes: Fortune.RecordTypeDefinitions;

  // ===================================================================================================================
  // Methods
  // ===================================================================================================================


  /**
   * Create a new instance, the only required input is record type definitions.
   * The first argument must be an object keyed by name, valued by definition
   * objects.
   *
   * Here are some example field definitions:
   *
   * ```js
   * {
   *   // Top level keys are names of record types.
   *   person: {
   *     // Data types may be singular or plural.
   *     name: String, // Singular string value.
   *     luckyNumbers: Array(Number), // Array of numbers.
   *
   *     // Relationships may be singular or plural. They must specify which
   *     // record type it refers to, and may also specify an inverse field
   *     // which is optional but recommended.
   *     pets: [ Array('animal'), 'owner' ], // Has many.
   *     employer: [ 'organization', 'employees' ], // Belongs to.
   *     likes: Array('thing'), // Has many (no inverse).
   *     doing: 'activity', // Belongs to (no inverse).
   *
   *     // Reflexive relationships are relationships in which the record type,
   *     // the first position, is of the same type.
   *     following: [ Array('person'), 'followers' ],
   *     followers: [ Array('person'), 'following' ],
   *
   *     // Mutual relationships are relationships in which the inverse,
   *     // the second position, is defined to be the same field on the same
   *     // record type.
   *     friends: [ Array('person'), 'friends' ],
   *     spouse: [ 'person', 'spouse' ]
   *   }
   * }
   * ```
   *
   * The above shows the shorthand which will be transformed internally to a
   * more verbose data structure. The internal structure is as follows:
   *
   * ```js
   * {
   *   person: {
   *     // A singular value.
   *     name: { type: String },
   *
   *     // An array containing values of a single type.
   *     luckyNumbers: { type: Number, isArray: true },
   *
   *     // Creates a to-many link to `animal` record type. If the field `owner`
   *     // on the `animal` record type is not an array, this is a many-to-one
   *     // relationship, otherwise it is many-to-many.
   *     pets: { link: 'animal', isArray: true, inverse: 'owner' },
   *
   *     // The `min` and `max` keys are open to interpretation by the specific
   *     // adapter, which may introspect the field definition.
   *     thing: { type: Number, min: 0, max: 100 },
   *
   *     // Nested field definitions are invalid. Use `Object` type instead.
   *     nested: { thing: { ... } } // Will throw an error.
   *   }
   * }
   * ```
   *
   * The allowed native types are `String`, `Number`, `Boolean`, `Date`,
   * `Object`, and `Buffer`. Note that the `Object` type should be a JSON
   * serializable object that may be persisted. The only other allowed type is
   * a `Function`, which may be used to define custom types.
   *
   * A custom type function should accept one argument, the value, and return a
   * boolean based on whether the value is valid for the type or not. It may
   * optionally have a method `compare`, used for sorting in the built-in
   * adapters. The `compare` method should have the same signature as the native
   * `Array.prototype.sort`.
   *
   * A custom type function must inherit one of the allowed native types. For
   * example:
   *
   * ```js
   * function Integer (x) { return (x | 0) === x }
   * Integer.prototype = new Number()
   * ```
   *
   * The options object may contain the following keys:
   *
   * - `adapter`: configuration array for the adapter. The default type is the
   *   memory adapter. If the value is not an array, its settings will be
   *   considered omitted.
   *
   *   ```js
   *   {
   *     adapter: [
   *       // Must be a class that extends `Fortune.Adapter`, or a function
   *       // that accepts the Adapter class and returns a subclass. Required.
   *       Adapter => { ... },
   *
   *       // An options object that is specific to the adapter. Optional.
   *       { ... }
   *     ]
   *   }
   *   ```
   *
   * - `hooks`: keyed by type name, valued by an array containing an `input`
   *   and/or `output` function at indices `0` and `1` respectively.
   *
   *   A hook function takes at least two arguments, the internal `context`
   *   object and a single `record`. A special case is the `update` argument for
   *   the `update` method.
   *
   *   There are only two kinds of hooks, before a record is written (input),
   *   and after a record is read (output), both are optional. If an error occurs
   *   within a hook function, it will be forwarded to the response. Use typed
   *   errors to provide the appropriate feedback.
   *
   *   For a create request, the input hook may return the second argument
   *   `record` either synchronously, or asynchronously as a Promise. The return
   *   value of a delete request is inconsequential, but it may return a value or
   *   a Promise. The `update` method accepts a `update` object as a third
   *   parameter, which may be returned synchronously or as a Promise.
   *
   *   An example hook to apply a timestamp on a record before creation, and
   *   displaying the timestamp in the server's locale:
   *
   *   ```js
   *   {
   *     recordType: [
   *       (context, record, update) => {
   *         switch (context.request.method) {
   *           case 'create':
   *             record.timestamp = new Date()
   *             return record
   *           case 'update': return update
   *           case 'delete': return null
   *         }
   *       },
   *       (context, record) => {
   *         record.timestamp = record.timestamp.toLocaleString()
   *         return record
   *       }
   *     ]
   *   }
   *   ```
   *
   *   Requests to update a record will **NOT** have the updates already applied
   *   to the record.
   *
   *   Another feature of the input hook is that it will have access to a
   *   temporary field `context.transaction`. This is useful for ensuring that
   *   bulk write operations are all or nothing. Each request is treated as a
   *   single transaction.
   *
   * - `documentation`: an object mapping names to descriptions. Note that there
   *   is only one namepspace, so field names can only have one description.
   *   This is optional, but useful for the HTML serializer, which also emits
   *   this information as micro-data.
   *
   *   ```js
   *   {
   *     documentation: {
   *       recordType: 'Description of a type.',
   *       fieldName: 'Description of a field.',
   *       anotherFieldName: {
   *         en: 'Two letter language code indicates localized description.'
   *       }
   *     }
   *   }
   *   ```
   *
   * - `settings`: internal settings to configure.
   *
   *   ```js
   *   {
   *     settings: {
   *       // Whether or not to enforce referential integrity. This may be
   *       // useful to disable on the client-side.
   *       enforceLinks: true,
   *
   *       // Name of the application used for display purposes.
   *       name: 'My Awesome Application',
   *
   *       // Description of the application used for display purposes.
   *       description: 'media type "application/vnd.micro+json"'
   *     }
   *   }
   *   ```
   *
   * The return value of the constructor is the instance itself.
   */
  constructor(recordTypes?: Fortune.RecordTypeDefinitions, options?: Fortune.Options);

  /**
   * This is the primary method for initiating a request.
   * The resolved response object should always be an instance of a response
   * type.
   */
  request(options: Fortune.RequestOptions): Promise<Fortune.Response>

  /**
   * The `find` method retrieves record by type given IDs, querying options,
   * or both. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  find(type: string, ids?: Fortune.ID | Fortune.ID[], options?: Fortune.FindOptions, include?: Fortune.Include, meta?: object): Promise<Fortune.Response>

  /**
   * The `create` method creates records by type given records to create. This
   * is a convenience method that wraps around the `request` method, see the
   * request `method` for documentation on its arguments.
   */
  create(type: string, records: object | object[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response>

  /**
   * The `update` method updates records by type given update objects. See the
   * [Adapter.update](#adapter-update) method for the format of the update
   * objects. This is a convenience method that wraps around the `request`
   * method, see the `request` method for documentation on its arguments.
   */
  update(type: string, updates: object | object[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response>

  /**
   * The `delete` method deletes records by type given IDs (optional). This is a
   * convenience method that wraps around the `request` method, see the `request`
   * method for documentation on its arguments.
   */
  delete(type: string, ids?: Fortune.ID | Fortune.ID[], include?: Fortune.Include, meta?: object): Promise<Fortune.Response>

  /**
   * This method does not need to be called manually, it is automatically called
   * upon the first request if it is not connected already. However, it may be
   * useful if manually reconnect is needed. The resolved value is the instance
   * itself.
   */
  connect(): Promise<Fortune>

  /**
   * Close adapter connection, and reset connection state. The resolved value is
   * the instance itself.
   */
  disconnect(): Promise<Fortune>
}

// =====================================================================================================================
// Other declarations in namespace
// =====================================================================================================================

declare namespace Fortune {

  // ===================================================================================================================
  // Type definitions
  // ===================================================================================================================

  /**
   * Hook type
   */
  export type Hook = [HookFunction, HookFunction?]

  /**
   * Hooks type
   */
  export type Hooks = { [recordType: string]: Hook };

  /**
   * ID type
   */
  export type ID = string | number;

  /**
   * Include type
   */
  export type Include = (string | [string, object])[][]

  /**
   * Message type
   */
  export type Message = (id: string, language?: string, data?: any) => any;


  // ===================================================================================================================
  // Enums
  // ===================================================================================================================

  /**
   * Enum for events
   */
  export enum Event {
    change = 'change',
    sync = 'sync',
    connect = 'connect',
    disconnect = 'disconnect',
    failure = 'failure'
  }

  /**
   * Enum for methods
   */
  export enum Method {
    find = 'find',
    create = 'create',
    update = 'update',
    delete = 'delete'
  }


  // ===================================================================================================================
  // Interfaces
  // ===================================================================================================================

  /**
   * Find records by IDs and options. If IDs is undefined, it usually try to return all records.
   * However, if IDs is an empty array, it is a no-op.
   *
   * For the fields exists, match, and range, the logic operator is usually "and".
   * The query field may be used on a per adapter basis to provide custom querying functionality.
   *
   * The format of the options may be as follows:
   * ```typescript
   * {
   *    sort: { ... },
   *    fields: { ... },
   *    exists: { ... },
   *    match: { ... },
   *    range: { ... },
   *
   *    // Limit results to this number. Zero means no limit.
   *    limit: 0,
   *
   *    // Offset results by this much from the beginning.
   *    offset: 0,
   *
   *    // The logical operator "and", may be nested. Optional feature.
   *    and: { ... },
   *
   *    // The logical operator "or", may be nested. Optional feature.
   *    or: { ... },
   *
   *    // Reserved field for custom querying.
   *    query: null
   * }
   * ```
   */
  export interface FindOptions {

    /**
     * Adapter specific options
     */
    [key: string]: any;

    /**
     * The syntax of the sort object is as follows:
     * ```typescript
     * {
     *    age: false, // descending
     *    name: true // ascending
     * }
     * ```
     */
    sort?: {[fieldName: string]: boolean};

    /**
     * Fields can be specified to be either included or omitted, but not both.
     * Use the values true to include, or false to omit.
     *
     * The syntax of the fields object is as follows:
     * ```typescript
     * {
     *    name: true, // include this field
     *    age: true // also include this field
     * }
     * ``
     */
    fields?: {[fieldName: string]: boolean};

    /**
     * The exists object specifies if a field should exist or not (true or false).
     * For array fields, it should check for non-zero length.
     */
    exists?: {[fieldName: string]: boolean};

    /**
     * The syntax of the match object is straightforward:
     *
     * ```typescript
     * {
     *    name: 'value', // exact match or containment if array
     *    friends: [ 'joe', 'bob' ] // match any one of these values
     * }
     * ```
     */
    match?: {[fieldName: string]: any};

    /**
     * The range object is used to filter between lower and upper bounds. It should take precedence over match.
     * For array fields, it should apply on the length of the array. For singular link fields, it should not apply.
     *
     * ```typescript
     * {
     *    range: { // Ranges should be inclusive.
     *      age: [ 18, null ], // From 18 and above.
     *      name: [ 'a', 'd' ], // Starting with letters A through C.
     *      createdAt: [ null, new Date(2016, 0) ] // Dates until 2016.
     *    }
     * }
     * ```
     */
    range?: {[fieldName: string]: [any, any]};

    /**
     * Limit results to this number. Zero means no limit.
     */
    limit?: number,

    /**
     * Offset results by this much from the beginning.
     */
    offset?: number,

    /**
     * The logical operator "and", may be nested. Optional feature.
     */
    and?: object,

    /**
     * The logical operator "or", may be nested. Optional feature.
     */
    or?: object,

    /**
     * Reserved field for custom querying.
     */
    query?: any
  }

  /**
   * Input / Output hook function
   *
   * I/O hooks isolate business logic, and are part of what makes the interface reusable across different protocols.
   * An input and output hook function may be defined per record type. Hook functions accept at least two arguments,
   * the context object, the record, and optionally the update object for an update request. The method of an input
   * hook may be any method except find, and an output hook may be applied on all methods.
   *
   * An input hook function may optionally return or resolve a value to determine what gets persisted, and it is safe
   * to mutate any of its arguments. The returned or resolved value must be the record if it's a create request, the
   * update if it's an update request, or anything (or simply null) if it's a delete request. For example, an input
   * hook function for a record may look like this:
   *
   * ```typescript
   * function input (context, record, update) {
   *   switch (context.request.method) {
   *     // If it's a create request, return the record.
   *     case 'create': return record
   *
   *     // If it's an update request, return the update.
   *     case 'update': return update
   *
   *     // If it's a delete request, the return value doesn't matter.
   *     case 'delete': return null
   *   }
   * }
   * ```
   *
   * An output hook function may optionally return or resolve a record, and it is safe to mutate any of its arguments.
   *
   * ```typescript
   * function output (context, record) {
   *   record.accessedAt = new Date()
   *   return record
   * }
   *
   * Based on whether or not the resolved record is different from what was passed in, serializers may decide not to
   * show the resolved record of the output hook for update and delete requests.
   *
   * Hooks for a record type may be defined as follows:
   * ```typescript
   * const store = fortune({
   *   user: { ... }
   * }, {
   *   hooks: {
   *     // Hook functions must be defined in order: input first, output last.
   *     user: [ input, output ]
   *   }
   * })
   * ```
   */
  export interface HookFunction {
    (context: object, record: object, update?: object): any | null | undefined
  }

  /**
   * Record type definitions: object keyed by name, valued by definition objects
   *
   * Here are some example field definitions:
   *
   * ```js
   * {
   *   // Top level keys are names of record types.
   *   person: {
   *     // Data types may be singular or plural.
   *     name: String, // Singular string value.
   *     luckyNumbers: Array(Number), // Array of numbers.
   *
   *     // Relationships may be singular or plural. They must specify which
   *     // record type it refers to, and may also specify an inverse field
   *     // which is optional but recommended.
   *     pets: [ Array('animal'), 'owner' ], // Has many.
   *     employer: [ 'organization', 'employees' ], // Belongs to.
   *     likes: Array('thing'), // Has many (no inverse).
   *     doing: 'activity', // Belongs to (no inverse).
   *
   *     // Reflexive relationships are relationships in which the record type,
   *     // the first position, is of the same type.
   *     following: [ Array('person'), 'followers' ],
   *     followers: [ Array('person'), 'following' ],
   *
   *     // Mutual relationships are relationships in which the inverse,
   *     // the second position, is defined to be the same field on the same
   *     // record type.
   *     friends: [ Array('person'), 'friends' ],
   *     spouse: [ 'person', 'spouse' ]
   *   }
   * }
   * ```
   */
  export interface RecordTypeDefinitions {
    [key: string]: { [property: string]: any };
  }

  /**
   * The options object may contain the following keys:
   *
   * - `adapter`: configuration array for the adapter. The default type is the
   *   memory adapter. If the value is not an array, its settings will be
   *   considered omitted.
   *
   *   ```js
   *   {
   *     adapter: [
   *       // Must be a class that extends `Fortune.Adapter`, or a function
   *       // that accepts the Adapter class and returns a subclass. Required.
   *       Adapter => { ... },
   *
   *       // An options object that is specific to the adapter. Optional.
   *       { ... }
   *     ]
   *   }
   *   ```
   *
   * - `hooks`: keyed by type name, valued by an array containing an `input`
   *   and/or `output` function at indices `0` and `1` respectively.
   *
   *   A hook function takes at least two arguments, the internal `context`
   *   object and a single `record`. A special case is the `update` argument for
   *   the `update` method.
   *
   *   There are only two kinds of hooks, before a record is written (input),
   *   and after a record is read (output), both are optional. If an error occurs
   *   within a hook function, it will be forwarded to the response. Use typed
   *   errors to provide the appropriate feedback.
   *
   *   For a create request, the input hook may return the second argument
   *   `record` either synchronously, or asynchronously as a Promise. The return
   *   value of a delete request is inconsequential, but it may return a value or
   *   a Promise. The `update` method accepts a `update` object as a third
   *   parameter, which may be returned synchronously or as a Promise.
   *
   *   An example hook to apply a timestamp on a record before creation, and
   *   displaying the timestamp in the server's locale:
   *
   *   ```js
   *   {
   *     recordType: [
   *       (context, record, update) => {
   *         switch (context.request.method) {
   *           case 'create':
   *             record.timestamp = new Date()
   *             return record
   *           case 'update': return update
   *           case 'delete': return null
   *         }
   *       },
   *       (context, record) => {
   *         record.timestamp = record.timestamp.toLocaleString()
   *         return record
   *       }
   *     ]
   *   }
   *   ```
   *
   *   Requests to update a record will **NOT** have the updates already applied
   *   to the record.
   *
   *   Another feature of the input hook is that it will have access to a
   *   temporary field `context.transaction`. This is useful for ensuring that
   *   bulk write operations are all or nothing. Each request is treated as a
   *   single transaction.
   *
   * - `documentation`: an object mapping names to descriptions. Note that there
   *   is only one namepspace, so field names can only have one description.
   *   This is optional, but useful for the HTML serializer, which also emits
   *   this information as micro-data.
   *
   *   ```js
   *   {
   *     documentation: {
   *       recordType: 'Description of a type.',
   *       fieldName: 'Description of a field.',
   *       anotherFieldName: {
   *         en: 'Two letter language code indicates localized description.'
   *       }
   *     }
   *   }
   *   ```
   *
   * - `settings`: internal settings to configure.
   *
   *   ```js
   *   {
   *     settings: {
   *       // Whether or not to enforce referential integrity. This may be
   *       // useful to disable on the client-side.
   *       enforceLinks: true,
   *
   *       // Name of the application used for display purposes.
   *       name: 'My Awesome Application',
   *
   *       // Description of the application used for display purposes.
   *       description: 'media type "application/vnd.micro+json"'
   *     }
   *   }
   *   ```
   **/
  export interface Options {
    adapter?: Fortune.Adapter[],
    hooks?: Fortune.Hooks,
    documentation?: { [recordOrField: string]: string | { [language: string]: string } }
    settings?: {
      enforceLinks?: boolean,
      name?: string,
      description?: string
    }
  }


  /**
   * Request options object may contain the following keys:
   *
   * - `method`: The method is a either a function or a constant, which is keyed
   *   under `Fortune.common.methods` and may be one of `find`, `create`,
   *   `update`, or `delete`. Default: `find`.
   *
   * - `type`: Name of a type. **Required**.
   *
   * - `ids`: An array of IDs. Used for `find` and `delete` methods only. This is
   *   optional for the `find` method.
   *
   * - `include`: A 3-dimensional array specifying links to include. The first
   *   dimension is a list, the second dimension is depth, and the third
   *   dimension is an optional tuple with field and query options. For example:
   *   `[['comments'], ['comments', ['author', { ... }]]]`.
   *
   * - `options`: Exactly the same as the [`find` method](#adapter-find)
   *   options in the adapter. These options do not apply on methods other than
   *   `find`, and do not affect the records returned from `include`. Optional.
   *
   * - `meta`: Meta-information object of the request. Optional.
   *
   * - `payload`: Payload of the request. **Required** for `create` and `update`
   *   methods only, and must be an array of objects. The objects must be the
   *   records to create, or update objects as expected by the Adapter.
   *
   * - `transaction`: if an existing transaction should be re-used, this may
   *   optionally be passed in. This must be ended manually.
   */
  export interface RequestOptions {
    method?: Function | Method | string;
    type: string;
    ids?: ID[];
    include?: Include;
    options?: object;
    meta?: object;
    payload?: object[];
    transaction?: object;
  }

  /**
   * The response object may contain the following keys:
   *
   * - `meta`: Meta-info of the response.
   *
   * - `payload`: An object containing the following keys:
   *   - `records`: An array of records returned.
   *   - `count`: Total number of records without options applied (only for
   *     responses to the `find` method).
   *   - `include`: An object keyed by type, valued by arrays of included
   *     records.
   *
   * The resolved response object should always be an instance of a response
   * type.
   */
  export interface Response<T = any> {
    meta?: {[key: string]: any};
    payload: {
      records: T[],
      count?: number,
      include?: { [type: string]: {[key: string]: any}[] }
    }
  }

  // ===================================================================================================================
  // Classes
  // ===================================================================================================================

  /**
   * Adapter is an abstract base class containing methods to be implemented. All
   * records returned by the adapter must have the primary key `id`. The primary
   * key **MUST** be a string or a number.
   *
   * It has one static property, `defaultAdapter` which is a reference to the
   * memory adapter.
   *
   * See: http://fortune.js.org/api/#adapter
   */
  export abstract class Adapter {

    // =================================================================================================================
		// Properties
		// =================================================================================================================

    /**
     * Adapter specific properties
     */
    [key: string]: any;

    /**
     * An object which enumerates record types and their definitions
     */
    recordTypes?: RecordTypeDefinitions;

    /**
     * The options passed to the adapter
     */
    options?: object;

    /**
     * Object containing all internal utilities
     */
    common?: object;

    /**
     * Custom error types, useful for throwing errors in I/O hooks
     */
    static errors?: { [error: string]: Error };

    /**
     * An object which enumerates reserved constants for record type
     */
    keys?: object;

    /**
     * A message function
     */
    message?: Message;


    // =================================================================================================================
		// Methods
		// =================================================================================================================


    /**
     * The responsibility of this method is to ensure that the record types
     * defined are consistent with the backing data store. If there is any
     * mismatch it should either try to reconcile differences or fail.
     * This method **SHOULD NOT** be called manually, and it should not accept
     * any parameters. This is the time to do setup tasks like create tables,
     * ensure indexes, etc. On successful completion, it should resolve to no
     * value.
     */
    protected connect: () => Promise<void>;

    /**
     * Close the database connection.
     */
    protected disconnect: () => Promise<void>;

    /**
     * Create records. A successful response resolves to the newly created
     * records.
     *
     * **IMPORTANT**: the record must have initial values for each field defined
     * in the record type. For non-array fields, it should be `null`, and for
     * array fields it should be `[]` (empty array). Note that not all fields in
     * the record type may be enumerable, such as denormalized inverse fields, so
     * it may be necessary to iterate over fields using
     * `Object.getOwnPropertyNames`.
     */
    create: (type: string, records: object[], meta?: object) => Promise<any>;

    /**
     * Find records by IDs and options. If IDs is undefined, it should try to
     * return all records. However, if IDs is an empty array, it should be a
     * no-op. The format of the options may be as follows:
     *
     * ```js
     * {
     *   sort: { ... },
     *   fields: { ... },
     *   exists: { ... },
     *   match: { ... },
     *   range: { ... },
     *
     *   // Limit results to this number. Zero means no limit.
     *   limit: 0,
     *
     *   // Offset results by this much from the beginning.
     *   offset: 0,
     *
     *   // The logical operator "and", may be nested. Optional feature.
     *   and: { ... },
     *
     *   // The logical operator "or", may be nested. Optional feature.
     *   or: { ... },
     *
     *   // Reserved field for custom querying.
     *   query: null
     * }
     * ```
     *
     * For the fields `exists`, `match`, and `range`, the logical operator should
     * be "and". The `query` field may be used on a per adapter basis to provide
     * custom querying functionality.
     *
     * The syntax of the `sort` object is as follows:
     *
     * ```js
     * {
     *   age: false, // descending
     *   name: true // ascending
     * }
     * ```
     *
     * Fields can be specified to be either included or omitted, but not both.
     * Use the values `true` to include, or `false` to omit. The syntax of the
     * `fields` object is as follows:
     *
     * ```js
     * {
     *   name: true, // include this field
     *   age: true // also include this field
     * }
     * ```
     *
     * The `exists` object specifies if a field should exist or not (`true` or
     * `false`). For array fields, it should check for non-zero length.
     *
     * ```js
     * {
     *   name: true, // check if this fields exists
     *   age: false // check if this field doesn't exist
     * }
     * ```
     *
     * The syntax of the `match` object is straightforward:
     *
     * ```js
     * {
     *   name: 'value', // exact match or containment if array
     *   friends: [ 'joe', 'bob' ] // match any one of these values
     * }
     * ```
     *
     * The `range` object is used to filter between lower and upper bounds. It
     * should take precedence over `match`. For array fields, it should apply on
     * the length of the array. For singular link fields, it should not apply.
     *
     * ```js
     * {
     *   range: { // Ranges should be inclusive.
     *     age: [ 18, null ], // From 18 and above.
     *     name: [ 'a', 'd' ], // Starting with letters A through C.
     *     createdAt: [ null, new Date(2016, 0) ] // Dates until 2016.
     *   }
     * }
     * ```
     *
     * The return value of the promise should be an array, and the array **MUST**
     * have a `count` property that is the total number of records without limit
     * and offset.
     */
    find: (type: string, ids?: ID[], options?: Fortune.FindOptions, meta?: object) => Promise<any>;

    /**
     * Update records by IDs. Success should resolve to the number of records
     * updated. The `updates` parameter should be an array of objects that
     * correspond to updates by IDs. Each update object must be as follows:
     *
     * ```js
     * {
     *   // ID to update. Required.
     *   id: 1,
     *
     *   // Replace a value of a field. Use a `null` value to unset a field.
     *   replace: { name: 'Bob' },
     *
     *   // Append values to an array field. If the value is an array, all of
     *   // the values should be pushed.
     *   push: { pets: 1 },
     *
     *   // Remove values from an array field. If the value is an array, all of
     *   // the values should be removed.
     *   pull: { friends: [ 2, 3 ] },
     *
     *   // The `operate` field is specific to the adapter. This should take
     *   // precedence over all of the above. Warning: using this may bypass
     *   // field definitions and referential integrity. Use at your own risk.
     *   operate: null
     * }
     * ```
     *
     * Things to consider:
     *
     * - `push` and `pull` can not be applied to non-arrays.
     * - The same value in the same field should not exist in both `push` and
     * `pull`.
     *
     * @param {String} type
     * @param {Object[]} updates
     * @param {Object} [meta]
     * @return {Promise}
     */
    update: (type: string, updates: object[], meta?: object) => Promise<any>;

    /**
     * Delete records by IDs, or delete the entire collection if IDs are
     * undefined or empty. Success should resolve to the number of records
     * deleted.
     */
    delete: (type: string, ids?: ID[], meta?: object) => Promise<number>;

    /**
     * Begin a transaction to write to the data store. This method is optional
     * to implement, but useful for ACID. It should resolve to an object
     * containing all of the adapter methods.
     */
    beginTransaction: () => Promise<object>;

    /**
     * End a transaction. This method is optional to implement.
     * It should return a Promise with no value if the transaction is
     * completed successfully, or reject the promise if it failed.
     */
    endTransaction: (error?: Error) => Promise<void>;

    /**
     * Apply operators on a record, then return the record. If you make use of
     * update operators, you should implement this method so that the internal
     * implementation of update requests get records in the correct state. This
     * method is optional to implement.
     *
     * @param operators - The `operate` field on an `update` object.
     */
    applyOperators: (record: object, operators: object) => object;
  }
}
