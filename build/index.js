const { debuglog } = require('util');
let bosom = require('bosom'); if (bosom && bosom.__esModule) bosom = bosom.default;
let getIp = require('@rqt/ip'); if (getIp && getIp.__esModule) getIp = getIp.default;
let Authenticator = require('./lib/Authenticator'); if (Authenticator && Authenticator.__esModule) Authenticator = Authenticator.default;
let App = require('./lib/App'); if (App && App.__esModule) App = App.default;
const { deepEqual } = require('./lib');
let whois = require('./whois'); if (whois && whois.__esModule) whois = whois.default;
let coupon = require('./coupon'); if (coupon && coupon.__esModule) coupon = coupon.default;

const LOG = debuglog('@rqt/namecheap-web')

const getHost = (S) => {
  return `https://www.${S ? 'sandbox.' : ''}namecheap.com`
}
const getApHost = (S) => {
  return `https://ap.www.${S ? 'sandbox.' : ''}namecheap.com`
}

const USER_AGENT = 'Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web'

/**
 * An API to namecheap.com via the web interface, with an ability to log in using 2-factor Auth and check Whois.
 */
               class NamecheapWeb {
  /**
   * Create an instance of a new client.
   * @param {Options} options Options for the web client.
 * @param {boolean} [options.sandbox=false] Whether to use the `sandbox` version. Default `false`.
 * @param {boolean} [options.readSession=false] Read and store the cookies for the session from the local file. Default `false`.
 * @param {string} [options.sessionFile=".namecheap-web.json"] If reading session, indicates the file where to store cookies. Default `.namecheap-web.json`.
   */
  constructor(options = {}) {
    const {
      sandbox,
      readSession,
      sessionFile = '.namecheap-web.json',
    } = options
    this.settings = {
      sandbox,
      readSession,
      sessionFile,
    }
  }

  /**
   * Return the whois information about the domain.
   */
  static async WHOIS(domain) {
    return whois(domain, USER_AGENT)
  }
  /**
   * Return the coupon from the https://www.namecheap.com/promos/coupons/ page.
   */
  static async COUPON() {
    return coupon(USER_AGENT)
  }
  /**
   * Return the coupon from the https://www.sandbox.namecheap.com/promos/coupons/ page.
   */
  static async SANDBOX_COUPON() {
    return coupon(USER_AGENT, true)
  }

  async auth(username, password, phone, force) {
    let cookies
    if (this.settings.readSession && !force) {
      cookies = await getSession(this.settings.sessionFile)
    }
    if (!cookies) {
      const host = getHost(this.settings.sandbox)
      const authenticator = new Authenticator({
        username,
        password,
        host,
        phone,
        userAgent: USER_AGENT,
      })

      await authenticator.obtainSession()
      cookies = await authenticator.signIn()
      await this._saveSession(cookies)
    }

    const apHost = getApHost(this.settings.sandbox)
    this._app = new App({
      cookies,
      password,
      host: apHost,
      userAgent: USER_AGENT,
    })
    const works = await this._wrap(this._app.test())
    if (!works && force) {
      throw new Error('Could not authenticate.')
    }
    if (!works) {
      await this.auth(username, password, phone, true)
    }
  }
  async _saveSession(cookies) {
    if (this.settings.readSession) {
      await saveSession(cookies, this.settings.sessionFile)
    }
  }
  /**
   * Execute a method from the app and update cookies file if needed (to extend session).
   * @private
   */
  async _wrap(p) {
    const c = getAllowedCookies(this._app.session.cookies)
    const res = await p
    const c2 = getAllowedCookies(this._app.session.cookies)
    try {
      deepEqual(c, c2)
    } catch ({ message }) {
      LOG(message)
      await this._saveSession(c2)
    }
    return res
  }
  /**
   * Add an IP to white-listed IPs.
   */
  async whitelistIP(ip, name) {
    await this._wrap(this._app.whitelistIP(ip, name))
  }
  /**
   * Get the list of all whitelisted IP addresses from https://ap.www.namecheap.com/settings/tools/apiaccess/whitelisted-ips.
   * @return {Promise.<WhitelistedIP[]>}
   */
  async getWhitelistedIPList() {
    const res = await this._wrap(this._app.getWhitelistedIPList())
    return res
  }
  /**
   * Get the public IP address using https://api.ipify.org.
   */
  static async LOOKUP_IP() {
    const res = await getIp()
    return res
  }
  /**
   * Remove the IP from the white-listed IPs by its name.
   */
  async removeWhitelistedIP(name) {
    await this._wrap(this._app.removeWhitelistedIP(name))
  }
}

const getAllowedCookies = (cookies) => {
  const keys = ['x-ncpl-auth', '.ncauth', 'SessionId', 'U']
  return Object.keys(cookies).reduce((acc, k) => {
    if (keys.includes(k)) return { ...acc, [k]: cookies[k] }
    return acc
  }, {})
}

const getSession = async (path) => {
  try {
    const cookies = await bosom(path)
    return cookies
  } catch (err) {
    return null
  }
}
const saveSession = async (cookies, path) => {
  await bosom(path, cookies)
}

/* documentary types/options.xml */
/**
 * @typedef {Object} Options Options for the web client.
 * @prop {boolean} [sandbox=false] Whether to use the `sandbox` version. Default `false`.
 * @prop {boolean} [readSession=false] Read and store the cookies for the session from the local file. Default `false`.
 * @prop {string} [sessionFile=".namecheap-web.json"] If reading session, indicates the file where to store cookies. Default `.namecheap-web.json`.
 */

/* documentary types/ips.xml */
/**
 * @typedef {Object} WhitelistedIP A white-listed IP which can be used for API calls.
 * @prop {string} Name The name of the IP.
 * @prop {string} IpAddress The IP address.
 * @prop {Date} ModifyDate The modification date.
 */


module.exports = NamecheapWeb