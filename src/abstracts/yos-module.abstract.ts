import { YosHelper, YosModuleConfig, YosServer } from '..';

/**
 * Absract class for yos-server modules
 */
export abstract class YosModule {

  // Individual properties of the module
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
  protected constructor(yosServer: YosServer, config?: YosModuleConfig) {
    this._yosServer = yosServer;
    this._config = config;
  }

  /**
   * Initialize method
   */
  public static init(yosServer: YosServer, config?: YosModuleConfig): YosModule | Promise<YosModule> {
    throw new Error('The static init method of "' + YosHelper.getClassName(this) + '" must be set. Check whether the method is in the class and whether it is static.');
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
