import { debuglog } from 'util'
import bosom from 'bosom'
import getIp from '@rqt/ip'
import Authenticator from './lib/Authenticator'
import App from './lib/App'
import { deepEqual } from './lib'
import whois from './whois'
import coupon from './coupon'

const LOG = debuglog('@rqt/namecheap-web')

/**
 * @param {string} S
 */
const getHost = (S) => {
  return `https://www.${S ? 'sandbox.' : ''}namecheap.com`
}
/**
 * @param {string} S
 */
const getApHost = (S) => {
  return `https://ap.www.${S ? 'sandbox.' : ''}namecheap.com`
}

const USER_AGENT = 'Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web'

/**
 * An API to namecheap.com via the web interface, with an ability to log in using 2-factor Auth and check Whois.
 * @implements {_namecheap.NamecheapWeb}
 */
export default class NamecheapWeb {
  /**
   * Create an instance of a new client.
   * @param {!_namecheap.Options} options Options for the web client.
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
   * @param {string} domain
   */
  static async WHOIS(domain) {
    return whois(domain, USER_AGENT)
  }
  /**
   *
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

  /**
   * @param {string} username
   * @param {string} password
   * @param {string} [phone]
   * @param {boolean} [force]
   */
  async auth(username, password, phone, force = false) {
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
   * @param {string} ip
   * @param {string} name
   */
  async whitelistIP(ip, name) {
    await this._wrap(this._app.whitelistIP(ip, name))
  }
  /**
   * Get the list of all whitelisted IP addresses from https://ap.www.namecheap.com/settings/tools/apiaccess/whitelisted-ips.
   */
  async getWhitelistedIPList() {
    const res = /** @type {<!Array<!_namecheap.WhitelistedIP>>} */ (await this._wrap(this._app.getWhitelistedIPList()))
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
   * @param {string} name
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

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').Options} _namecheap.Options
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').WhitelistedIP} _namecheap.WhitelistedIP
 */