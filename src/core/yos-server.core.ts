import * as express from 'express';
import * as http from 'http';
import * as _ from 'lodash';
import {
  YosActionHook,
  YosContext,
  YosHelper,
  YosHooksService,
  YosInitializer,
  YosModules,
  YosServerConfig,
  YosServerDefaultConfig,
  YosServices
} from '..';
import getPort = require('get-port');

/**
 * The core of yos-server
 */
export class YosServer {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /** Current configuration */
  protected _config: YosServerConfig;

  /** Express app (as basis for all modules) */
  protected _expressApp: express.Application;

  /** Loaded modules */
  protected _modules: YosModules = {};

  /** HTTP server */
  protected _server: http.Server;

  /** YosServicesConfig */
  protected _services: YosServices = {};

  protected _context: YosContext = {};


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

    // Init express app (as basis for all modules)
    yosServer.expressApp = express();

    // Init services
    await YosInitializer.initServices(yosServer.config.services, yosServer);

    // Init Modules
    await YosInitializer.initModules(yosServer.config.modules, yosServer);

    // Start Server
    await yosServer.serve();

    // Return Server
    return yosServer;
  }

  /**
   * Combination of the current configuration with the transferred configuration
   *
   * Here the process.env's are taken into account
   *
   * @param { YosServerConfig | string | string[]} configOrPaths Could be a configuration Object, a string or
   *  string array with the path(s) to configuration file or directory
   * @returns {Promise<void>}
   */
  public async initConfiguration(configOrPaths?: YosServerConfig | string | string[]) {

    // Init environment
    const environment = process.env.NODE_ENV || 'development';

    // Init loaded configuration
    let loadedConfiguration: YosServerConfig = <YosServerConfig> configOrPaths;

    // Set configuration via string or string array
    if (_.isString(configOrPaths) || Array.isArray(configOrPaths)) {
      loadedConfiguration = await YosInitializer.loadConfigs(configOrPaths);
    }

    // Process configurations in paths
    const paths = _.get(configOrPaths, 'core.configurations.paths');
    if (paths) {
      const configsFromPaths = await YosInitializer.loadConfigs(paths);

      // configurations from the paths overwrite the loaded configuration
      if (_.get(configOrPaths, 'core.configurations.pathsOverwriteCurrent')) {
        YosHelper.specialMerge(loadedConfiguration, configsFromPaths);
      }

      // configurations from the loaded configuration overwrite the configs from path
      else {
        loadedConfiguration = YosHelper.specialMerge(configsFromPaths, loadedConfiguration);
      }
    }

    // Merge loaded configuration into default configuration
    YosHelper.specialMerge(this._config, loadedConfiguration);

    // Set hostname if not set
    _.set(this._config, 'core.yosServer.hostname', _.get(this._config, 'core.yosServer.hostname', '0.0.0.0'));
    if (process.env.HOSTNAME && process.env.HOSTNAME.length) {
      this._config.core.yosServer.hostname = process.env.HOSTNAME;
    }

    // Set free port
    const getPortConf: any = {host: this._config.core.yosServer.hostname};
    const port = _.get(this._config, 'core.yosServer.port');
    if (port) {
      getPortConf.port = port;
    }
    _.set(this._config, 'core.yosServer.port', await getPort(getPortConf));
    if (process.env.PORT && process.env.PORT.length) {
      this._config.core.yosServer.hostname = process.env.PORT;
    }

    // Set name if not set
    _.set(this._config, 'core.yosServer.name', _.get(this._config, 'core.yosServer.name', 'YosServer'));

    // Set environment
    this._config.environment = environment;
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
    return new Promise<express.Application>(async (resolve, reject) => {

      // Action hook: before server start
      const hooksService: YosHooksService = _.get(this._services, 'hooksService');
      if (hooksService) {
        await hooksService.performActions(YosActionHook.BeforeServerStart);
      }

      // Start server
      this._server = this.expressApp.listen(port, hostname, async () => {
        console.log(name + ' started: ' + this.url);

        // Action hook: after server start
        if (hooksService) {
          await hooksService.performActions(YosActionHook.AfterServerStart);
        }

        resolve(this.expressApp);
      });

      // Check server status
      if (!this._server) {
        reject();
      }

      // On close
      this._server.on('close', () => {
        console.log(name + 'closed');
      });
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
   * Getter for context
   * @returns {YosContext}
   */
  public get context(): YosContext {
    return this._context;
  }

  /**
   * Setter for context
   * @param {YosContext} context
   */
  public set context(context: YosContext) {
    this._context = context;
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
   * Getter for modules
   * @returns YosModules
   */
  public get modules(): YosModules {
    return this._modules;
  }

  /**
   * Setter for modules
   * @param {YosModules} modules
   */
  public set modules(modules: YosModules) {
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

  /**
   * Getter for services
   * @returns YosServices
   */
  public get services(): YosServices {
    return this._services;
  }

  /**
   * Setter for services
   * @param {YosServices} services
   */
  public set services(services: YosServices) {
    this._services = services;
  }


  // ===================================================================================================================
  // Artificial Getter & Setter
  // ===================================================================================================================

  /**
   * Getter for hostname
   * @returns {string}
   */
  public get hostname(): string {
    return _.get(this._config, 'core.yosServer.hostname');
  }

  /**
   * Getter for port
   * @returns {string}
   */
  public get port(): string {
    return _.get(this._config, 'core.yosServer.port');
  }

  /**
   * Getter for url
   * @returns {string}
   */
  public get url(): string {
    return 'http://' + this.hostname + ':' + this.port;
  }
}
