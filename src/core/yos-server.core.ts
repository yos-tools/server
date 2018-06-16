import * as _ from 'lodash';
import { FileHelper } from '../helper/file-helper.helper';
import { HelpFunctions } from '../helper/help-functions.helper';
import { YosServerConfig } from '../interfaces/yos-server-config.interface';
import { YosServerDefaultConfig } from './yos-server-default-config.core';

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
   * @param {YosServerConfig | string | string[]} configOrPath Could be a configuration Object or a string with the
   *   path to configuration file or directory
   * @param {YosServer} yosServer Use optional an existing server instance
   * @returns {Promise<YosServer>} New Instance of yos-server
   */
  public static async start(
    configOrPath?: YosServerConfig | string | string[],
    yosServer: YosServer = new YosServer()
  ): Promise<YosServer> {

    // Combine configurations
    yosServer.combineConfigurations(configOrPath);

    // Init Modules

    // Start Server

    // Return Server
    return yosServer;
  }

  /**
   * Combination of the current configuration with the transferred configuration
   * @param { YosServerConfig | string | string[]} configOrPath
   * @returns {Promise<void>}
   */
  public async combineConfigurations(configOrPath?: YosServerConfig | string | string[]) {

    // Handling for string or string array
    if (_.isString(configOrPath) || Array.isArray(configOrPath)) {
      HelpFunctions.specialMerge(this._config, await FileHelper.loadConfigs(configOrPath));
    }

    // Handling for YosServerConfig object
    else {

      // Process configuration path if set
      const path = _.get(configOrPath, 'core.configuration.path');
      if (path) {
        HelpFunctions.specialMerge(this._config, await FileHelper.loadConfigs(path));
      }

      HelpFunctions.specialMerge(this._config, configOrPath);
    }
  }


  // ===================================================================================================================
  // Getter & Setter
  // ===================================================================================================================

  public get config(): YosServerConfig {
    return this.config;
  }

  public set config(config: YosServerConfig) {
    this._config = config;
  }
}
