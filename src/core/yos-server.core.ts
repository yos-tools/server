import * as http from 'http';
import * as _ from 'lodash';
import * as express from 'express';
import { Loader, HelpFunctions, YosServerConfig, YosServerDefaultConfig, YosServerModule, HooksService } from '..';
import getPort = require('get-port');

/**
 * The core of yos-server
 */
export class YosServer {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  // Current configuration
  protected _config: YosServerConfig;

  // Express app (as basis for all modules)
  protected _expressApp: express.Application;

  // Service for hook handling
  protected _hooksService: HooksService;

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
    await yosServer.initConfiguration(configOrPaths);

    // Init services (as basis for all modules)
    yosServer.initServices();

    // Init Modules
    yosServer.initModules();

    // Start Server
    await yosServer.serve();

    // Return Server
    return yosServer;
  }

  /**
   * Combination of the current configuration with the transferred configuration
   * @param { YosServerConfig | string | string[]} configOrPaths Could be a configuration Object, a string or
   *  string array with the path(s) to configuration file or directory
   * @returns {Promise<void>}
   */
  public async initConfiguration(configOrPaths?: YosServerConfig | string | string[]) {

    // Init loaded configuration
    let loadedConfiguration: YosServerConfig = <YosServerConfig> configOrPaths;

    // Set configuration via string or string array
    if (_.isString(configOrPaths) || Array.isArray(configOrPaths)) {
      loadedConfiguration = await Loader.loadConfigs(configOrPaths);
    }

    // Process configurations in paths
    const paths = _.get(configOrPaths, 'core.configurations.paths');
    if (paths) {
      const configsFromPaths = await Loader.loadConfigs(paths);

      // configurations from the paths overwrite the loaded configuration
      if (_.get(configOrPaths, 'core.configurations.pathsOverwriteCurrent')) {
        HelpFunctions.specialMerge(loadedConfiguration, configsFromPaths);
      }

      // configurations from the loaded configuration overwrite the configs from path
      else {
        loadedConfiguration = HelpFunctions.specialMerge(configsFromPaths, loadedConfiguration);
      }
    }

    // Merge loaded configuration into default configuration
    HelpFunctions.specialMerge(this._config, loadedConfiguration);

    // Set hostname if not set
    _.set(this._config,'core.yosServer.hostname', _.get(this._config, 'core.yosServer.hostname', '0.0.0.0'));

    // Set name if not set
    _.set(this._config,'core.yosServer.name', _.get(this._config, 'core.yosServer.name', 'YosServer'));

    // Set free port
    const getPortConf: any = {host: this._config.core.yosServer.hostname};
    const port = _.get(this._config, 'core.yosServer.port');
    if (port) {
      getPortConf.port = port;
    }
    _.set(this._config,'core.yosServer.port', await getPort(getPortConf));
  }

  /**
   * Initialize services (as basis for all modules)
   */
  public initServices() {

    // Init hooks
    this._hooksService = new HooksService();


    // Init express app
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

    // Configuration
    const hostname = _.get(this._config, 'core.yosServer.hostname');
    const name = _.get(this._config, 'core.yosServer.name');
    const port = _.get(this._config, 'core.yosServer.port');

    // Generate promise to handle callbacks
    return new Promise<express.Application>( async (resolve, reject) => {

      // Start server
      this._server = this.expressApp.listen(port, hostname, () => {
        console.log(name + ' started: '+hostname+':'+port);
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
   * Getter for hooksService
   * @returns {HooksService}
   */
  public get hooksService(): HooksService {
    return this._hooksService;
  }

  /**
   * Setter for hooksService
   * @param {HooksService} hooksService
   */
  public set hooksService(hooksService: HooksService) {
    this._hooksService = hooksService;
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
