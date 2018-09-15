/**
 * Configuration of jwt
 */
export interface YosJwtConfig {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /** Must be set in the project, otherwise an error is thrown */
  secretOrPrivateKey?: string;

  /** Options of JSON web token **/
  options?: {

    /** For the configuration options, see: https://github.com/auth0/node-jsonwebtoken */
    [key: string]: any;

    /** Algorithm, default: HS256 **/
    algorithm?: string;

    /**
     * Expire configuration
     *
     * Expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h",
     * "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units
     * (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms")
     */
    expiresIn?: string;

    // ... see https://github.com/auth0/node-jsonwebtoken
  }
}
