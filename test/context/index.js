import { resolve } from 'path'
import { debuglog } from 'util'
import bosom from 'bosom'

const LOG = debuglog('@rqt/namecheap-web')

const FIXTURE = resolve(__dirname, '../fixture')

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    LOG('init context')
    const auth = process.env.PROD ? '.auth.json' : '.auth-sandbox.json'
    const { username, password } = await bosom(auth)
    this.username = username
    this.password = password
    this.sandbox = !process.env.PROD
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  async _destroy() {
    LOG('destroy context')
  }
  async readCredentials() {

  }
}