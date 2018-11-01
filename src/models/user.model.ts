import { model, prop, YosPersistentModel, YosRole } from '..';

/**
 * User model
 */
@model({recordTypeName: 'user'})
export class User extends YosPersistentModel {

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
}
