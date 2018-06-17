import { YosServer } from '..';

/**
 * Absract class for yos-server modules
 */
export abstract class YosServerModule {

  /**
   * Current yos-server instance
   */
  protected _yosServer: YosServer;

  /**
   * Every Module gets the current yos-server instance
   * @param {YosServer} yosServer
   */
  constructor(yosServer: YosServer){
    this._yosServer = yosServer;
    this.init();
  }

  /**
   * Initialize method
   */
  protected abstract init(): any;

  /**
   * Getter for yosServer
   * @returns {YosServer}
   */
  public get yosServer(){
    return this._yosServer;
  }

  /**
   * Setter for yosServer
   * @param {YosServer} yosServer
   */
  public set yosServer(yosServer: YosServer){
    this._yosServer = yosServer;
  }
}
