export interface YosContext {

  /** Every (custom) property is allowed */
  [prop: string]: any;

  /** process.env.IP_LOOKUP_KEY for [ipstack API](https://ipstack.com) **/
  IP_LOOKUP_KEY?: string;

  /** Response of [ipstack API](https://ipstack.com): http://api.ipstack.com/check?access_key=IP_LOOKUP_KEY **/
  ipLookup?: any;
}
