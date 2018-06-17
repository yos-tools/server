/**
 * Interface for yos-server core configuration
 */
export interface YosServerCoreConfig {

  // Configuration of automatic configuration handling
  configurations?: {

    // If a configuration object is transferred, another path is transferred for auto handling
    path?: string | string[]
  }

  // Configuration of modules
  modules: {

    // Full path of directory of additional modules in project
    directory: string,

    // Extension of file name
    fileNameExtension: string,

    // Extension of module name
    moduleNameExtension: 'Module'
  },

  // Configuration of yos-server
  yosServer?: {

    // Hostname under which the server runs
    // '0.0.0.0' => accessible from outside
    // '127.0.0.1' / 'localhost' => local-only interface
    hostname?: string,

    // Port on which the server is running
    port?: number
  }
}
