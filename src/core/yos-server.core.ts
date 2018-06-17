import * as _ from 'lodash';
import { FileHelper, HelpFunctions, YosServerConfig, YosServerDefaultConfig } from '..';

/**
 * The core of yos-server
 */
export class YosServer {

  // ===================================================================================================================
  // Variables
  // ===================================================================================================================

  protected _config: YosServerConfig;


  // ===================================================================================================================
  // Constructor
  // ===================================================================================================================

  constructor() {
    this._config = new YosServerDefaultConfig();
  }

  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Start a new yos-server instance
   *
   * @param {YosServerConfig | string | string[]} configOrPaths Could be a configuration Object, a string or
   *  string array with the path(s) to configuration file or directory
   * @param {YosServer} yosServer Use optional an existing server instance
   * @returns {Promise<YosServer>} New Instance of yos-server
   */
  public static async start(
    configOrPaths?: YosServerConfig | string | string[],
    yosServer: YosServer = new YosServer()
  ): Promise<YosServer> {

    // Combine configurations
    yosServer.combineConfigurations(configOrPaths);

    // Init Modules
    yosServer.initModules();

    // Start Server

    // Return Server
    return yosServer;
  }

  /**
   * Combination of the current configuration with the transferred configuration
   * @param { YosServerConfig | string | string[]} configOrPaths Could be a configuration Object, a string or
   *  string array with the path(s) to configuration file or directory
   * @returns {Promise<void>}
   */
  public async combineConfigurations(configOrPaths?: YosServerConfig | string | string[]) {

    // Handling for string or string array
    if (_.isString(configOrPaths) || Array.isArray(configOrPaths)) {
      HelpFunctions.specialMerge(this._config, await FileHelper.loadConfigs(configOrPaths));
    }

    // Handling for YosServerConfig object
    else {

      // Process configuration path if set
      const path = _.get(configOrPaths, 'core.configurations.path');
      if (path) {
        HelpFunctions.specialMerge(this._config, await FileHelper.loadConfigs(path));
      }

      HelpFunctions.specialMerge(this._config, configOrPaths);
    }
  }

  /**
   * Initialization of modules
   * @returns {Promise<void>}
   */
  public async initModules() {

  }


  // ===================================================================================================================
  // Getter & Setter
  // ===================================================================================================================

  /**
   * Getter for config
   * @returns {YosServerConfig}
   */
  public get config(): YosServerConfig {
    return this._config;
  }

  /**
   * Setter for config
   * @param {YosServerConfig} config
   */
  public set config(config: YosServerConfig) {
    this._config = config;
  }
}
