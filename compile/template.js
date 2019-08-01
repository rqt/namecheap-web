const _NamecheapWeb = require('./namecheapweb')

class NamecheapWeb extends _NamecheapWeb {
  /**
   * @fnType {_namecheap.NamecheapWeb.constructor}
   */
  constructor(options) {
    super(options)
  }
  /**
   * @fnType {_namecheap.NamecheapWeb.auth}
   */
  auth(username, password, phone, force) {
    return super.auth(username, password, phone, force)
  }
  /**
   * @fnType {_namecheap.NamecheapWeb.getWhitelistedIPList}
   */
  getWhitelistedIPList() {
    return super.getWhitelistedIPList()
  }
  /**
   * @fnType {_namecheap.NamecheapWeb.removeWhitelistedIP}
   */
  removeWhitelistedIP(name) {
    return super.removeWhitelistedIP(name)
  }
  /**
   * @fnType {_namecheap.NamecheapWeb.whitelistIP}
   */
  whitelistIP(ip, name) {
    return super.whitelistIP(ip, name)
  }
  /**
   * @fnType {_namecheap.NamecheapWeb.COUPON}
   */
  static COUPON() {
    return super.COUPON()
  }
  /**
   * @fnType {_namecheap.NamecheapWeb.SANDBOX_COUPON}
   */
  static SANDBOX_COUPON() {
    return super.SANDBOX_COUPON()
  }
  /**
   * @fnType {_namecheap.NamecheapWeb.WHOIS}
   */
  static WHOIS(domain) {
    return super.WHOIS(domain)
  }
  /**
   * @fnType {_namecheap.NamecheapWeb.LOOKUP_IP}
   */
  static LOOKUP_IP() {
    return super.LOOKUP_IP()
  }
}

module.exports = NamecheapWeb

/* typal types/ips.xml noSuppress closure */

/* typal types/options.xml noSuppress closure */
