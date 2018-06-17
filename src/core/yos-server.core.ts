import * as http from 'http';
import * as _ from 'lodash';
import * as express from 'express';
import { Loader, HelpFunctions, YosServerConfig, YosServerDefaultConfig, YosServerModule } from '..';
import getPort = require('get-port');

/**
 * The core of yos-server
 */
export class YosServer {

  // ===================================================================================================================
  // Variables
  // ===================================================================================================================

  // Current configuration
  protected _config: YosServerConfig;

  // Express app (as basis for all modules)
  protected _expressApp: express.Application;

  // Loaded modules
  protected _modules: { [module: string]: YosServerModule } = {};

  // HTTP server
  protected _server: http.Server;


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

    // Init Express (as basis for all modules)
    yosServer.initExpress();

    // Init Modules
    yosServer.initModules();

    // Start Server
    yosServer.serve();

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
      HelpFunctions.specialMerge(this._config, await Loader.loadConfigs(configOrPaths));
    }

    // Handling for YosServerConfig object
    else {

      // Process configuration path if set
      const path = _.get(configOrPaths, 'core.configurations.path');
      if (path) {
        HelpFunctions.specialMerge(this._config, await Loader.loadConfigs(path));
      }

      HelpFunctions.specialMerge(this._config, configOrPaths);
    }
  }

  /**
   * Initialize express application
   */
  public initExpress() {
    this._expressApp = express();
  }

  /**
   * Initialization of modules
   */
  public initModules() {

    // Load core modules
    Object.assign(this._modules, Loader.loadModules(this, this._config.coreModules, _.get(this._config, 'core.coreModules')));

    // Load project modules
    Object.assign(this._modules, Loader.loadModules(this, this._config.modules, _.get(this._config, 'core.modules')));
  }

  /**
   * Start server
   * @returns {Promise<void>}
   */
  public async serve() {

    // Generate promise to handle callbacks
    return new Promise<express.Application>( async (resolve, reject) => {

      // Set hostname
      let hostname = _.get(this._config, 'core.yosServer.hostname')
      if (hostname) {
        hostname = '0.0.0.0';
        _.set(this._config,'core.yosServer.hostname', hostname);
      }

      // Set port
      const getPortConf: any = {host: this._config.core.yosServer.hostname};
      let port = _.get(this._config, 'core.yosServer.port');
      if (port) {
        getPortConf.port = port;
      }
      port = await getPort(getPortConf);
      _.set(this._config,'core.yosServer.port', port);

      // Start server
      this._server = this.expressApp.listen(port, hostname, () => {
        console.log('YosServer started: '+hostname+':'+port);
        resolve(this.expressApp);
      });

      // Check server status
      if (!this._server) {
        reject();
      }
    });
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

  /**
   * Getter for modules
   * @returns {{ [module: string]: YosServerModule }}
   */
  public get modules(): { [module: string]: YosServerModule } {
    return this._modules;
  }

  /**
   * Setter for modules
   * @param {{ [module: string]: YosServerModule }} modules
   */
  public set modules(modules: { [module: string]: YosServerModule }) {
    this._modules = modules;
  }

  /**
   * Getter for expressApp
   * @returns {express.Application}
   */
  public get expressApp(): express.Application {
    return this._expressApp;
  }

  /**
   * Setter for expressApp
   * @param {express.Application} expressApp
   */
  public set expressApp(expressApp: express.Application) {
    this._expressApp = expressApp;
  }

  /**
   * Getter for server
   * @returns {http.Server}
   */
  public get server(): http.Server {
    return this._server;
  }

  /**
   * Setter for server
   * @param {http.Server} server
   */
  public set server(server: http.Server) {
    this._server = server;
  }
}
