/**
 * Interface for configuration of yos-server modules
 */
export interface YosServerModuleConfig {

  // Individual properties of the module
  [prop: string]: any,

  // Information about the module
  module: {

    // Active status of the module
    // true => module is activated
    // false => module is deactivated
    active: boolean

    // File name of the module
    fileName: string

    // Name of the module
    className: string
  }
}
