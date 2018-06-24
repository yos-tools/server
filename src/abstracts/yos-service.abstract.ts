import { YosHelper, YosServer, YosServiceConfig } from '..';

/**
 * Absract class for yos-server service
 */
export abstract class YosService {

  // Individual properties of the service
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
   * @returns {YosService | typeof YosService}
   */
  public static init(yosServer: YosServer, config?: YosServiceConfig): YosService | Promise<YosService> | typeof YosService | Promise<typeof YosService> {
    throw new Error('The static init method of "' + YosHelper.getClassName(this) + '" must be set. ' +
      'Check whether the method is in the class and whether it is static. ' +
      'If the service only uses static methods, the init method can return the class, otherwise an instance of the class must be returned.');
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
