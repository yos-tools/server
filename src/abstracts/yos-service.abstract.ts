import { YosHelper, YosServer, YosServiceConfig } from '..';

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
   * @param yosServer - Current yos-server instance
   * @param config - Configuration of the service
   * @param params
   */
  public constructor(yosServer: YosServer, config: YosServiceConfig = <any>{}, ...params: any[]) {
    this._yosServer = yosServer;
    this._config = config;
  }

  /**
   * Static initialize method
   * @param yosServer - Current yos-server instance
   * @param config - Configuration of the service
   * @param params
   */
  public static init(yosServer: YosServer, config: YosServiceConfig = <any>{}, ...params: any[]): YosService | Promise<YosService> {
    const module = new (<any>this)(yosServer, config);
    return module.init(yosServer, config);
  };

  /**
   * Initialize method
   * @param yosServer - Current yos-server instance
   * @param config - Configuration of the service
   * @param params
   */
  public init(yosServer: YosServer, config: YosServiceConfig = <any>{}, ...params: any[]): YosService | Promise<YosService> {
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
