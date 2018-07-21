import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { YosService } from '..';

/**
 * Authentication service
 */
export class YosAuthenticationService extends YosService {

  // ===================================================================================================================
  // Init
  // ===================================================================================================================

  /**
   * Initialization of the static authentication service
   * @returns {typeof YosAuthenticationService}
   */
  public static init(): typeof YosAuthenticationService {
    return YosAuthenticationService;
  }

  // ===================================================================================================================
  // Static Methods
  // ===================================================================================================================

  /**
   * Create a new token
   * @param data
   * @param {string} secretOrPrivateKey
   * @param options
   * @returns {string}
   */
  public static createToken(data: any, secretOrPrivateKey: string, options?: any): string {
    return jwt.sign(data, secretOrPrivateKey, options);
  }

  /**
   * Verify Token and get data
   * @param {string} token
   * @param {string} secretOrPublicKey
   * @param options see https://github.com/auth0/node-jsonwebtoken
   * @returns {object | string}
   */
  public static getTokenData(token: string, secretOrPublicKey: string, options?: any): object | string {
    return jwt.verify(token, secretOrPublicKey, options);
  }

  /**
   * Hash a password
   * @param {string} password
   * @param config
   * @returns {Promise<string>}
   */
  public static hashPassword(password: string, config: any = {saltRounds: 10}): Promise<string> {
    return bcrypt.hash(password, config.saltRounds);
  }

  /**
   * Check a password against a hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  public static checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
