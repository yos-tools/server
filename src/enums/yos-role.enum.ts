export enum YosRole {

  /**
   * Must be an admin
   */
  Admin = 'ADMIN',

  /**
   * Open to all requests
   */
  Any =  'ANY',

  /**
   * Must be logged in
   */
  User = 'USER',

  /**
   * User must have created / be this type
   */
  Owner = 'OWNER'
}
