import * as globby from 'globby';
import * as _ from 'lodash';
import * as path from 'path';
import {
  YosHelper,
  YosModule,
  YosModules,
  YosModulesConfig,
  YosServer,
  YosService,
  YosServices,
  YosServicesConfig
} from '..';

/**
 * YosInitializer is a collection of helper functions to load configs, modules, ...
 */
export class YosInitializer {

  /**
   * Load files via require
   * @param {string | string[]} fileOrDirPaths String or string array with file or directory path(s)
   * @param {{environment?: string, environmentDir?: string, patterns?: string[]}} config Config for file patterns and
   *   environment handling
   * @returns {Promise<any[]>}
   */
  public static async requireFiles(fileOrDirPaths: string | string[], config?: {
    environment?: string, environmentDir?: string, patterns?: string[]
  }): Promise<any[]> {

    // Process configuration
    config = Object.assign({
      patterns: ['**/*.js', '**/*.ts', '!**/*.d.ts', '**/*.json']
    }, config);

    // Init element array
    const loadedElements: any = [];

    // Check file or dir paths
    if (!fileOrDirPaths) {
      return loadedElements;
    }

    // Process array
    if (Array.isArray(fileOrDirPaths)) {
      for (const path of fileOrDirPaths) {
        loadedElements.concat(await YosInitializer.requireFiles(path, config));
      }
      return loadedElements;
    }

    // Get full path
    fileOrDirPaths = path.resolve(<string>fileOrDirPaths);

    // Single file handling
    try {
      loadedElements.push(require(fileOrDirPaths));
      return loadedElements;
    } catch (err) {}

    // Get paths of all files in directory
    const filePaths = (await globby(config.patterns, {cwd: fileOrDirPaths})).map((fileName) => {
      return path.join(<string>fileOrDirPaths, fileName);
    });

    // Process file paths
    for (const filePath of filePaths) {

      // Get element from file
      const singleElement = require(filePath);

      // Check the conditions of the environment
      if (config.environmentDir) {

        // Get names
        const dirName = path.dirname(filePath);
        const baseNameWithoutExtension = path.basename(filePath, path.extname(filePath));

        // If the directory is an environment directory and the file name does not match the current environment,
        // the current file is skipped
        if (dirName.toLocaleLowerCase().endsWith('/' + config.environmentDir) &&
          baseNameWithoutExtension.toLowerCase() !== config.environment) {
          continue;
        }
      }

      // Include single element
      loadedElements.push(singleElement);
    }

    // Return loaded elements
    return loadedElements;
  }

  /**
   * Load configurations from files
   * @param {string} fileOrDirPaths String or array of strings with file or directory path
   * @param {{environment: string, environmentDir: string, patterns: string[]}} config Configuration of the function
   * @returns {Promise<any>}
   */
  public static async loadConfigs(fileOrDirPaths: string | string[], config?: {
    environment?: string, environmentDir?: string, patterns?: string[]
  }): Promise<any> {

    // Process function configuration
    config = Object.assign({
      environment: process.env.NODE_ENV || 'development',
      environmentDir: 'env',
      patterns: ['**/*.js', '**/*.ts', '!**/*.d.ts', '**/*.json']
    }, config);

    // Init loaded config
    const loadedConfig: any = {};
    const loadedElements = await YosInitializer.requireFiles(fileOrDirPaths, config);

    // Include loaded Elements
    YosHelper.specialMerge(loadedConfig, ...loadedElements);

    // Return loaded config
    return loadedConfig;
  }

  /**
   * Initialize modules
   * @param {YosModulesConfig} modulesConfig
   * @param {YosServer} yosServer
   * @returns {Promise<{[module: string]: YosModule}>}
   */
  public static async initModules(modulesConfig: YosModulesConfig, yosServer: YosServer): Promise<YosModules> {

    // Init
    yosServer.modules = yosServer.modules ? yosServer.modules : {};
    const moduleArray: { id: string, position: number, item: any, config?: any }[] = [];

    // Check modules configuration
    if (!modulesConfig) {
      return yosServer.modules;
    }

    // Process modules configuration
    for (const id of Object.getOwnPropertyNames(modulesConfig)) {
      const item: any = modulesConfig[id];

      // Process instance
      if (item instanceof YosModule) {
        yosServer.modules[id] = item;
      }

      // Process class
      else if (typeof item === 'function') {
        moduleArray.push({id: id, position: 0, item: item});
      }

      // Process configuration
      else if (typeof item.module === 'function') {
        moduleArray.push({id: id, position: item.position ? item.position : 0, item: item.module, config: item});
      }

      // Throw error
      else {
        throw new Error('Missing module "' + id + '". Check the configuration file(s).');
      }
    }

    // Process sorted array
    for (const element of _.orderBy(moduleArray, 'position')) {

      // Check deactivated status
      if (element.config && element.config.deactivated) {
        continue;
      }

      yosServer.modules[element.id] = await element.item.init(yosServer, element.config);
    }

    // Return modules
    return yosServer.modules;
  }


  /**
   * Initialize services
   * @param {YosServicesConfig} servicesConfig
   * @param {YosServer} yosServer
   * @returns {Promise<{[service: string]: YosService}>}
   */
  public static async initServices(servicesConfig: YosServicesConfig, yosServer: YosServer): Promise<YosServices> {

    // Init
    yosServer.services = yosServer.services ? yosServer.services : {};
    const serviceArray: { id: string, position: number, item: any, config?: any }[] = [];

    // Check services configuration
    if (!servicesConfig) {
      return yosServer.services;
    }

    // Process services configuration
    for (const id of Object.getOwnPropertyNames(servicesConfig)) {
      const item: any = servicesConfig[id];

      // Process instance
      if (item instanceof YosService) {
        yosServer.services[id] = item;
      }

      // Process class
      else if (typeof item === 'function') {
        serviceArray.push({id: id, position: 0, item: item});
      }

      // Process configuration
      else if (typeof item.service === 'function') {
        serviceArray.push({id: id, position: item.position ? item.position : 0, item: item.service, config: item});
      }

      // Throw error
      else {
        throw new Error('Missing service "' + id + '". Check the configuration file(s).');
      }
    }

    // Process sorted array
    for (const element of _.orderBy(serviceArray, 'position')) {

      // Check deactivated status
      if (element.config && element.config.deactivated) {
        continue;
      }

      yosServer.services[element.id] = await element.item.init(yosServer, element.config);
    }

    // Return services
    return yosServer.services;
  }
}
