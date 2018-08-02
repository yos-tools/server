import { YosModuleConfig, YosServer } from '..';

/**
 * Absract class for yos-server modules
 */
export abstract class YosModule {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /**
   * Module configuration
   */
  protected _config: YosModuleConfig;

  /**
   * Current yos-server instance
   */
  protected _yosServer: YosServer;

  /**
   * Default constructor
   * @param {YosServer} yosServer Current yos-server instance
   * @param {YosModuleConfig} config Configuration of the module
   */
  public constructor(yosServer: YosServer, config?: YosModuleConfig) {
    this._yosServer = yosServer;
    this._config = config;
  }

  /**
   * Initialize method
   * @param {YosServer} yosServer
   * @param {YosModuleConfig} config
   */
  public static init(yosServer: YosServer, config?: YosModuleConfig): YosModule | Promise<YosModule> {
    return new (<any>this)(yosServer, config);
  };

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
   * @returns {YosModuleConfig}
   */
  public get config(): YosModuleConfig {
    return this._config;
  }

  /**
   * Setter for config
   * @param {YosModuleConfig} config
   */
  public set config(config: YosModuleConfig) {
    this._config = config;
  }
}
