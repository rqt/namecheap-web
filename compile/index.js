const _NamecheapWeb = require('./namecheapweb')

class NamecheapWeb extends _NamecheapWeb {
  /**
   * Performs namecheap.com operations via the web interface.
   * @param {_namecheap.WebOptions} [options] Options for the web client.
   * @param {boolean} [options.sandbox=false] Whether to use the `sandbox` version. Default `false`.
   * @param {boolean} [options.readSession=false] Read and store the cookies for the session from the local file. Default `false`.
   * @param {string} [options.sessionFile=".namecheap-web.json"] If reading session, indicates the file where to store cookies. Default `.namecheap-web.json`.
   */
  constructor(options) {
    super(options)
  }
  /**
   * Authenticate the app and obtain the cookies.
   * @param {string} username The username to log in with.
   * @param {string} password The password to enter.
   * @param {string=} [phone] The phone number to select for 2-factor auth.
   * @param {boolean=} [force] Try to log in even if session exists.
   * @return {!Promise}
   */
  auth(username, password, phone, force) {
    return super.auth(username, password, phone, force)
  }
  /**
   * Get a list of white-listed IP addresses which can make API calls.
   * @return {!Promise<!Array<!_namecheap.WhitelistedIP>>}
   */
  getWhitelistedIPList() {
    return super.getWhitelistedIPList()
  }
  /**
   * Remove the IP from the white-listed IPs by its name.
   * @param {string} name The name of the saved IP to remove.
   * @return {!Promise}
   */
  removeWhitelistedIP(name) {
    return super.removeWhitelistedIP(name)
  }
  /**
   * Add an IP address to the white-listed IPs.
   * @param {string} ip The IP to add.
   * @param {string=} [name] The name to save the IP as. If not given, it is automatically generated as _rqt {date}_.
   * @return {!Promise}
   */
  whitelistIP(ip, name) {
    return super.whitelistIP(ip, name)
  }
  /**
   * Return the coupon from the https://www.namecheap.com/promos/coupons/ page.
   * @return {!Promise<string>}
   */
  static COUPON() {
    return super.COUPON()
  }
  /**
   * Return the coupon from the https://www.sandbox.namecheap.com/promos/coupons/ page.
   * @return {!Promise<string>}
   */
  static SANDBOX_COUPON() {
    return super.SANDBOX_COUPON()
  }
  /**
   * Return the whois information about the domain.
   * @param {string} domain The domain name to get information about.
   * @return {!Promise<string>}
   */
  static WHOIS(domain) {
    return super.WHOIS(domain)
  }
  /**
   * Get the public IP address using https://api.ipify.org.
   * @return {!Promise<string>}
   */
  static LOOKUP_IP() {
    return super.LOOKUP_IP()
  }
}

module.exports = NamecheapWeb

/* typal types/ips.xml noSuppress closure */
/**
 * @typedef {_namecheap.WhitelistedIP} WhitelistedIP `＠record` A white-listed IP which can be used for API calls.
 */
/**
 * @typedef {Object} _namecheap.WhitelistedIP `＠record` A white-listed IP which can be used for API calls.
 * @prop {string} Name The name of the IP.
 * @prop {string} IpAddress The IP address.
 * @prop {!Date} ModifyDate The modification date.
 */

/* typal types/options.xml noSuppress closure */
/**
 * @typedef {_namecheap.WebOptions} WebOptions `＠record` Options for the web client.
 */
/**
 * @typedef {Object} _namecheap.WebOptions `＠record` Options for the web client.
 * @prop {boolean} [sandbox=false] Whether to use the `sandbox` version. Default `false`.
 * @prop {boolean} [readSession=false] Read and store the cookies for the session from the local file. Default `false`.
 * @prop {string} [sessionFile=".namecheap-web.json"] If reading session, indicates the file where to store cookies. Default `.namecheap-web.json`.
 */
