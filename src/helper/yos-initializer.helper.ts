import * as globby from 'globby';
import * as _ from 'lodash';
import * as path from 'path';
import { YosHelper, YosModule, YosModulesConfig, YosServer, YosService, YosServicesConfig } from '..';

/**
 * YosInitializer is a collection of helper functions to load configs, modules, ...
 */
export class YosInitializer {

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

    // Check file or dir path
    if (!fileOrDirPaths) {
      return loadedConfig;
    }

    // Process array
    if (Array.isArray(fileOrDirPaths)) {
      for (const path of fileOrDirPaths) {
        const loadedConfigs = YosInitializer.loadConfigs(path, config);
        YosHelper.specialMerge(loadedConfig, loadedConfigs);
      }
      return loadedConfig;
    }

    // Get full path
    fileOrDirPaths = path.resolve(<string>fileOrDirPaths);

    // File handling
    try {
      return require(fileOrDirPaths);
    } catch (err) {}

    // Get paths of all config files in directory
    const filePaths = (await globby(config.patterns, {cwd: fileOrDirPaths})).map((fileName) => {
      return path.join(<string>fileOrDirPaths, fileName);
    });

    // Combine configs
    for (const filePath of filePaths) {

      // Get config from file
      const singleConfig = require(filePath);

      // Get names
      const dirName = path.dirname(filePath);
      const baseNameWithoutExtension = path.basename(filePath, path.extname(filePath));

      // Special handling for environment directory
      if (config.environmentDir && dirName.toLocaleLowerCase().endsWith('/' + config.environmentDir)) {

        // Check if file name matches the environment
        if (baseNameWithoutExtension.toLowerCase() !== config.environment) {
          continue;
        }
      }

      // Include single config
      YosHelper.specialMerge(loadedConfig, singleConfig);
    }

    // Return loaded config
    return loadedConfig;
  }

  /**
   * Initialize modules
   * @param {YosModulesConfig} modulesConfig
   * @param {YosServer} yosServer
   * @returns {Promise<{[module: string]: YosModule}>}
   */
  public static async initModules(modulesConfig: YosModulesConfig, yosServer: YosServer): Promise<{ [module: string]: YosModule }> {

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
  public static async initServices(servicesConfig: YosServicesConfig, yosServer: YosServer): Promise<{ [service: string]: YosService }> {

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
      yosServer.services[element.id] = await element.item.init(yosServer, element.config);
    }

    // Return services
    return yosServer.services;
  }
}
