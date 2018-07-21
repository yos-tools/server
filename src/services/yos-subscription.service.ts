import { PubSub } from 'apollo-server';
import { YosServer, YosService, YosServiceConfig } from '..';

export class YosSubscriptionService extends YosService {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /** Publish and subscription handler */
  protected _pubSub: PubSub;


  // ===================================================================================================================
  // Init
  // ===================================================================================================================

  /**
   * Init instance of GraphQL service
   * @param {YosServer} yosServer
   * @param {YosServiceConfig} config
   * @returns {YosSubscriptionService}
   */
  public static init(yosServer: YosServer, config?: YosServiceConfig): YosSubscriptionService {

    // New instance
    const yosSubscriptionService = new YosSubscriptionService(yosServer, config);

    // Init PubSub
    yosSubscriptionService._pubSub = new PubSub();

    // Return instance
    return yosSubscriptionService;
  }


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Publish data for a specified trigger
   * @param {string} trigger ID of the trigger
   * @param {any} data Data which will be send
   * @param {string} field Encapsulate data in a specified field in payload (trigger ID is used for fallback)
   * @param {boolean} setField Whether the encapsulation is to be carried out or not
   * @returns {boolean}
   */
  public publish(trigger: string, data: any, field?: string, setField: boolean = true): boolean {

    // Set field name
    const fieldName: string = field || trigger;

    // Set payload
    let payload: any = {};
    if (setField) {
      payload[fieldName] = data;
    } else {
      payload = data;
    }

    // Publish
    return this._pubSub.publish(trigger, payload);
  }

  /**
   * Subscribe a trigger
   * @param {string} trigger
   * @param {(...args: any[]) => void} onMessage
   * @returns {Promise<number>}
   */
  public subscribe(trigger: string, onMessage: (...args: any[]) => void): Promise<number> {
    return this._pubSub.subscribe(trigger, onMessage)
  }

  /**
   * Unsubscribe from a trigger
   * @param {number} subscriptionId
   */
  public unsubscribe(subscriptionId: number) {
    this._pubSub.unsubscribe(subscriptionId);
  }

  /**
   * Connect a GraphQL resolver to a subscription to a specific trigger
   * @param {string | string[]} triggers
   * @returns {AsyncIterator<T>}
   */
  public asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return this._pubSub.asyncIterator(triggers);
  }


  // ===================================================================================================================
  // Getter & Setter
  // ===================================================================================================================

  /**
   * Getter for pubSub
   * @returns {PubSub}
   */
  public get pubSub(): PubSub {
    return this._pubSub;
  }

  /**
   * Setter for pubSub
   * @param {PubSub} pubSub
   */
  public set pubSub(pubSub: PubSub) {
    this._pubSub = pubSub;
  }
}
