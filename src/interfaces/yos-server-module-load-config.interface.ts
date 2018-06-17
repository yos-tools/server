/**
 * Interface for load configuration of yos-server modules
 */
export interface YosServerModuleLoadConfig {

  // Full path of directory of additional modules in project
  directory: string,

  // Extension of file name (e.g. 'module')
  fileNameExtension: string,

  // Extension of module name (e.g. 'Module')
  moduleNameExtension: string
}
