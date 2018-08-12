import { YosHelper, YosModuleConfig, YosServer } from '..';

/**
 * Absract class for yos-server modules
 */
export abstract class YosModule {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /**
   * Module configuration
   */
  protected _config: YosModuleConfig = <any>{};

  /**
   * Current yos-server instance
   */
  protected _yosServer: YosServer;

  /**
   * Default constructor
   * @param yosServer - Current yos-server instance
   * @param config - Configuration of the module
   * @param params - Additional params
   */
  public constructor(yosServer: YosServer, config: YosModuleConfig = <any>{}, ...params: any[]) {
    this._yosServer = yosServer;
    this._config = config;
  }

  /**
   * Static initialize method
   * @param yosServer - Current yos-server instance
   * @param config - Configuration of the module
   * @param params - Additional params
   */
  public static init(yosServer: YosServer, config: YosModuleConfig = <any>{}, ...params: any[]): YosModule | Promise<YosModule> {
    const module =  new (<any>this)(yosServer, config);
    return module.init(yosServer, config, ...params);
  };

  /**
   * Initialize method
   * @param yosServer
   * @param config
   * @param params
   */
  public init(yosServer: YosServer, config: YosModuleConfig = <any>{}, ...params: any[]): YosModule | Promise<YosModule> {
    this._yosServer = yosServer;
    this._config = YosHelper.specialMerge(this._config, config);
    return this;
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
