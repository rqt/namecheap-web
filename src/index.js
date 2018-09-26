import { debuglog } from 'util'
import { Session } from 'rqt'
import bosom from 'bosom'
import {
  extractXsrf,
} from './lib'
import Authenticator from './lib/Authenticator'

const LOG = debuglog('@rqt/namecheap-web')

const getHost = (S) => {
  return `https://www.${S ? 'sandbox.' : ''}namecheap.com`
}
const getApHost = (S) => {
  return `https://ap.www.${S ? 'sandbox.' : ''}namecheap.com`
}

const USER_AGENT = 'Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web'

class PrivateApp {
  /** @param {{cookies: *}} param */
  constructor({
    cookies,
    host,
    password, // needed for confirmations
  }) {
    // session.host = host // change host
    const session = new Session({
      host,
    })
    session.cookies = cookies
    this._session = session
    this.password = password
  }
  get session() {
    return this._session
  }
  async getToken() {
    const body = await this.session.rqt('/')
    const token = extractXsrf(body)
    debugger
  }
  async test() {
    const { statusCode } = await this.session.aqt('/', {
      justHeaders: true,
    })
    const res = statusCode == 200
    return res
  }
  async whitelistIP(ipAddress) {
    const name = `@rqt/namecheap ${new Date().toLocaleString()}`.replace(/:/g, '-')
    const data = {
      name,
      ipAddress,
      accountPassword: this.password,
    }
  }
}

// get whitelistedIpsPage() {
//   return this.makeSettingsUrl('tools/apiaccess/whitelisted-ips')
// }
// makeSettingsUrl(loc) {
//   const u = this.makeAppHostUrl(`/settings/${loc}`)
//   return u
// }

/**
 * An API to namecheap.com via the web interface, with an ability to log in using 2-factor Auth and check Whois.
 */
export default class NamecheapWeb {
  constructor({
    sandbox,
    readSession,
    sessionFile = '.namecheap-web.json',
  } = {}) {
    this.settings = {
      sandbox,
      readSession,
      sessionFile,
    }
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

      if (this.settings.readSession) {
        await saveSession(cookies, this.settings.sessionFile)
      }
    }

    // now make the app
    const apHost = getApHost(this.settings.sandbox)
    this.privateApp = new PrivateApp({
      cookies,
      password,
      host: apHost,
    })
    const works = await this.privateApp.test()
    if (!works && force) {
      throw new Error('Could not authenticate.')
    }
    if (!works) {
      await this.auth(username, password, phone, true)
    }
  }
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
