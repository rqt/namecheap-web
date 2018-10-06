const { Session } = require('rqt');
const { extractXsrf } = require('.');


/**
 * @typedef {Object} Result
 * @property {boolean} __isError
 * @property {string} Message
 * @property {{ Message: String }[]} Errors
 * @property {strings[]} Warnings
 * @property {boolean} Success
 */

/** @param {Result} res */
const checkError = (res) => {
  if (res.__isError) {
    const err = new Error(res.Message)
    Object.assign(err, res)
    throw err
  }
  if (!res.Success) {
    const t = res.Errors.map(({ Message }) => Message).join(', ')
    const r = new Error(t)
    r.__type = res.__type
    throw r
  }
}

               class App {
  /** @param {{cookies: *}} param */
  constructor({
    cookies,
    host,
    userAgent,
    password, // needed for confirmations
  }) {
    const session = new Session({
      host,
      headers: {
        'User-Agent': userAgent,
      },
    })
    session.cookies = cookies
    this._session = session
    this.password = password
  }
  get session() {
    return this._session
  }
  getToken(body) {
    const token = extractXsrf(body)
    return token
  }
  async test() {
    const { statusCode } = await this.session.aqt('/', {
      justHeaders: true,
    })
    const res = statusCode == 200
    return res
  }
  async whitelistIP(
    ipAddress,
    name = `@rqt ${new Date().toLocaleString()}`.replace(/:/g, '-'),
  ) {
    const token = await this.requestToken(App.WHITELISTED_UPS)
    const apiUrl = App.getApiUrl('AddIpAddress')
    const data = {
      accountPassword: this.password,
      ipAddress,
      name,
    }
    await this.request(apiUrl, token, data)
  }
  static get WHITELISTED_UPS() {
    return '/settings/tools/apiaccess/whitelisted-ips'
  }
  async removeWhitelistedIP(name) {
    const token = await this.requestToken(App.WHITELISTED_UPS)
    const apiUrl = App.getApiUrl('RemoveIpAddresses')
    await this.request(apiUrl, token, {
      accountPassword: this.password,
      names: [name],
    })
  }
  static getApiUrl(page) {
    return `/api/v1/ncpl/apiaccess/ui/${page}`
  }
  async requestToken(url) {
    const body = await this.session.rqt(url)
    const token = this.getToken(body)
    return token
  }
  async getWhitelistedIPList() {
    const token = await this.requestToken(App.WHITELISTED_UPS)
    const apiUrl = App.getApiUrl('GetWhitelistedIpAddresses')
    const { IpAddresses } = await this.request(apiUrl, token)
    const res = IpAddresses.map(({ Name, IpAddress, ModifyDate }) => ({
      Name,
      IpAddress,
      ModifyDate: new Date(`${ModifyDate}Z`),
    }))
    return res
  }
  async request(url, token, data) {
    const res = await this.session.jqt(url, {
      data,
      headers: {
        'x-ncpl-rcsrf': token,
      },
    })
    checkError(res)
    const { Data } = res
    return Data
  }
}

module.exports = App