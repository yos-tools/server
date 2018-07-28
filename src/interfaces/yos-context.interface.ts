export interface YosContext {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /** Response of [ipstack API](https://ipstack.com): http://api.ipstack.com/check?access_key=IP_LOOKUP_KEY **/
  ipLookup?: any;
}
