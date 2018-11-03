import { model, prop, YosHelper, YosPersistentModel, YosRole } from '..';

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
  public async map(data: any): Promise<this> {
    await YosHelper.map(data, this, 'username');
    await YosHelper.map(data, this, 'email');
    await YosHelper.map(data, this, 'password');
    await YosHelper.map(data, this, 'roles');
    return this;
  }
}
