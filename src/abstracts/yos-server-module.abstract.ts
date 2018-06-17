import { YosServer } from '..';

/**
 * Absract class for yos-server modules
 */
export abstract class YosServerModule {

  /**
   * Current yos-server instance
   */
  protected _yosServer: YosServer;

  /**
   * Module configuration
   */
  protected _config: any;

  /**
   * Default constructor
   * @param {YosServer} yosServer Current yos-server instance
   * @param {any} config Configuration of the Module
   */
  constructor(yosServer: YosServer, config?: any) {
    this._yosServer = yosServer;
    this._config = config;
    this.init();
  }

  /**
   * Initialize method
   */
  protected abstract init(): any;

  /**
   * Getter for yosServer
   * @returns {YosServer}
   */
  public get yosServer() {
    return this._yosServer;
  }

  /**
   * Setter for yosServer
   * @param {YosServer} yosServer
   */
  public set yosServer(yosServer: YosServer) {
    this._yosServer = yosServer;
  }

  /**
   * Getter for config
   * @returns {any}
   */
  public get config() {
    return this._config;
  }

  /**
   * Setter for config
   * @param {any} config
   */
  public set config(config: any) {
    this._config = config;
  }
}
