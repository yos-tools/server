/**
 * Configuration of jwt
 */
export interface YosJwtConfig {

  /** For the configuration options, see: https://github.com/auth0/node-jsonwebtoken */
  [key: string]: any,

  /** Must be set in the project, otherwise an error is thrown */
  secretOrPrivateKey?: string
}
