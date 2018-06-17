import * as globby from 'globby';
import * as path from 'path';
import { HelpFunctions } from '..';

/**
 * FileHelper is a collection of helper functions to process files
 */
export class FileHelper {

  /**
   * Load configurations from files
   * @param {string} fileOrDirPaths String or array of strings with file or directory path
   * @param {{environmentDir: string, patterns: string[]}} config Configuration of the function
   * @returns {Promise<any>}
   */
  public static async loadConfigs(fileOrDirPaths: string | string[], config?: { environmentDir: string, patterns: string[] }):
    Promise<any> {

    // Process function configuration
    config = Object.assign({
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
        const loadedConfigs = FileHelper.loadConfigs(path, config);
        HelpFunctions.specialMerge(loadedConfig, loadedConfigs);
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
        const environment = process.env.NODE_ENV || 'development';

        // Check if file name matches the environment
        if (baseNameWithoutExtension.toLowerCase() !== environment) {
          continue;
        }
      }

      // Include single config
      HelpFunctions.specialMerge(loadedConfig, singleConfig);
    }

    // Return loaded config
    return loadedConfig;
  }
}
