import { model, prop, YosPersistentModel, YosRole } from '..';

/**
 * User model
 */
@model({recordTypeName: 'user'})
export class YosUser extends YosPersistentModel {

  // ===================================================================================================================
  // Properties
  // ===================================================================================================================

  /**
   * Username
   */
  @prop({type: String})
  username: string;

  /**
   * E-Mail address
   */
  @prop({type: String})
  email: string;

  /**
   * Password
   */
  @prop({type: String})
  password: string;

  /**
   * Roles
   */
  @prop({type: Array(String)})
  roles: YosRole[];


  // ===================================================================================================================
  // Methods
  // ===================================================================================================================

  /**
   * Map function
   */
  public map(data: any): this {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.roles = data.roles;
    return this;
  }
}
