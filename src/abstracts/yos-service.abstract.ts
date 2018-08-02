import { YosServer, YosServiceConfig } from '..';

/**
 * Absract class for yos-server service
 */
export abstract class YosService {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /**
   * Module configuration
   */
  protected _config: YosServiceConfig;

  /**
   * Current yos-server instance
   */
  protected _yosServer: YosServer;

  /**
   * Default constructor
   * @param {YosServer} yosServer Current yos-server instance
   * @param {YosModuleConfig} config Configuration of the service
   */
  protected constructor(yosServer: YosServer, config?: YosServiceConfig) {
    this._yosServer = yosServer;
    this._config = config;
  }

  /**
   * Initialize method
   * @param {YosServer} yosServer
   * @param {YosServiceConfig} config
   */
  public static init<T extends YosService>(yosServer: YosServer, config?: YosServiceConfig): T | Promise<T> {
    return new (<any>this)(yosServer, config);
  }

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
   * @returns {YosServiceConfig}
   */
  public get config(): YosServiceConfig {
    return this._config;
  }

  /**
   * Setter for config
   * @param {YosServiceConfig} config
   */
  public set config(config: YosServiceConfig) {
    this._config = config;
  }
}
