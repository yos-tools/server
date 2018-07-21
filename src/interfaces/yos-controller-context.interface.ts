import { Request, Response } from 'express';
import { YosServer, YosModule, YosService } from '..';

/**
 * Interface for controller context
 */
export interface YosControllerContext {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /** Modules of yos-server instance (shortcut for yosServer.modules) */
  modules?: { [module: string]: YosService };

  /** Params from request */
  params?: { [param: string]: any };

  /** Express request */
  req?: Request;

  /** Express response */
  res?: Response;

  /** Services of yos-server instance (shortcut for yosServer.services) */
  services?: { [module: string]: YosModule };

  /** Yos-server instance */
  yosServer?: YosServer;
}
