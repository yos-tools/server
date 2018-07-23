import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { YosService } from '..';
import { YosServer } from '../index';

/**
 * Authentication service
 */
export class YosAuthenticationService extends YosService {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  protected _secretOrPrivateKey: string;


  // ===================================================================================================================
  // Init
  // ===================================================================================================================

  /**
   * Initialization of the authentication service
   * @param {YosServer} yosServer
   * @returns {YosAuthenticationService}
   */
  public static init(yosServer: YosServer): YosAuthenticationService {

    // Create new instance of authorization service
    const authenticationService = new YosAuthenticationService(yosServer);

    // Set secret or private key
    authenticationService._secretOrPrivateKey = _.get(yosServer, 'config.core.authorization.jwt.secretOrPrivateKey');
    if (!authenticationService._secretOrPrivateKey) {
      throw new Error('Missing secretOrPrivateKey in config: config.core.authorization.jwt.secretOrPrivateKey');
    }

    // Return authorize service instance
    return authenticationService;
  }


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Create a new token
   * @param data
   * @param options
   * @returns {string}
   */
  public createToken(data: any, options?: any): string {
    return jwt.sign(data, this._secretOrPrivateKey, options);
  }

  /**
   * Verify Token and get data
   * @param {string} token
   * @param options see https://github.com/auth0/node-jsonwebtoken
   * @returns {any}
   */
  public getTokenData(token: string, options?: any): any {
    const secretOrPublicKey =
      _.get(this.yosServer, 'config.core.authorization.jwt.secretOrPublicKey') || this._secretOrPrivateKey;
    return jwt.verify(token, secretOrPublicKey, options);
  }

  /**
   * Hash a password
   * @param {string} password
   * @param config
   * @returns {Promise<string>}
   */
  public hashPassword(password: string, config: any = {saltRounds: 10}): Promise<string> {
    return bcrypt.hash(password, config.saltRounds);
  }

  /**
   * Check a password against a hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  public checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
