const { debuglog } = require('util');
const { Session } = require('rqt');
const { ok } = require('assert');
const { askSingle } = require('reloquent');
const {
  extractOptions, extractFormState, askForNumber,
} = require('.');

const LOG = debuglog('@rqt/namecheap-web')

/**
 * A class used for 2-factor authentication.
 */
               class Authenticator {
  constructor({
    username,
    password,
    phone,
    host,
    userAgent,
  } = {}) {
    const session = new Session({
      host,
      headers: {
        'User-Agent': userAgent,
      },
    })
    this._username = username
    this._password = password
    this._session = session
    this._phone = phone
  }
  async obtainSession() {
    const u = '/cart/ajax/SessionHandler.ashx'
    const { SessionKey } = await this.session.jqt(u)
    if (!SessionKey) {
      throw new Error(`Could not acquire the session key from ${this.session.host}${u}.`)
    }
    LOG('Obtained a session key %s', SessionKey)
    this.SessionKey = SessionKey
  }
  async signIn() {
    const {
      body,
      statusCode,
      headers: { location },
    } = await this.session.aqt(Authenticator.LOGIN_URL, {
      data: {
        hidden_LoginPassword: '',
        LoginUserName: this._username,
        LoginPassword: this._password,
        sessionEncryptValue: this.SessionKey,
      },
      type: 'form',
    })
    if (statusCode == 200) {
      this.checkValidationError(body) // throws with validation message
    } else if (statusCode == 301) {
      return this.session.cookies
    }
    if (statusCode == 302 && location.includes(Authenticator.SECOND_AUTH_URL)) {
      await this.secondAuth()
    } else {
      throw new Error(`Unknown result (status code ${statusCode})`)
    }
    const { cookies } = this.session
    return cookies
  }
  static get LOGIN_URL() {
    return '/myaccount/login-signup.aspx'
  }
  static get SECOND_AUTH_URL() {
    return '/myaccount/twofa/secondauth.aspx'
  }
  async secondAuth() {
    const body = await this.session.rqt(Authenticator.SECOND_AUTH_URL)

    ok(
      /Select Phone Contact Number/.test(body),
      'Could not find the "Select Phone" section.',
    )

    const options = extractOptions(body)
    ok(options.length, 'Could not find any numbers.')

    const value = await askForNumber(options, this._phone)

    const fs = extractFormState(body)
    const data = {
      ...fs,
      ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$ddlAuthorizeList: value,
      ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnSendVerification: 'Proceed with Login',
    }
    const body2 = await this.session.rqt(Authenticator.SECOND_AUTH_URL, {
      data,
      type: 'form',
    })

    if (/You have reached the limit on the number.+/m.test(body2)) {
      throw new Error(body2.match(/You have reached the limit on the number.+/m)[0])
    }
    ok(
      /We sent a message with the verification code/.test(body2),
      'Could not find the code entry section.',
    )

    await this.submitCode(body2)
  }
  async submitCode(body) {
    const [, b] = /Your 6-digit code begins with (\d)./.exec(body) || []
    if (!b) throw new Error('Could not send the code.')

    const code = await askSingle({
      text: `Security code (begins with ${b})`,
    })
    const fs = extractFormState(body)
    const data = {
      ...fs,
      ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$txtAuthVerification: code,
      ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnVerify: 'Submit Security Code',
    }

    const {
      body: body2,
      headers: { location: location2 },
    } = await this.session.aqt(Authenticator.SECOND_AUTH_URL, {
      data,
      type: 'form',
    })
    if (/Oops, you entered an invalid code.+/m.test(body2)) {
      console.log('Incorrect code, try again.')
      const res = await this.submitCode(body2)
      return res
    }
    ok(/Object moved/.test(body2), 'Expected to have been redirected after sign-in.')
    return location2
  }
  checkValidationError(body = this.body) {
    const validationErrorRe = /<strong class="title">Validation Error<\/strong>\s+<div>(.+?)<\/div>/
    const [, err] = validationErrorRe.exec(body) || []
    if (err) throw new Error(err.replace(/(<([^>]+)>)/ig, ''))
  }
  get session() {
    return this._session
  }
}

module.exports = Authenticator