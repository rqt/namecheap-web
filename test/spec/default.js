import { ok } from 'zoroaster/assert'
import Context from '../context'
import NamecheapWeb from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'can whitelist an IP'({ username, password }) {
    const nw = new NamecheapWeb({
      sandbox: true,
    })
    // 1. Authenticate and create a session.
    await nw.auth(username, password)

    // 2. Read white-listed IPs.
    const ips = await nw.getWhitelistedIPList()
    ok(Array.isArray(ips))

    // 3. Whitelist a new IP.
    const ip = await NamecheapWeb.LOOKUP_IP()
    const name = '@rqt/namecheap-web test'
    await nw.whitelistIP(ip, name)

    // 4. Remove white-listed IP.
    await nw.removeWhitelistedIP(name)
  },
  async 'can whois'() {
    const res = await NamecheapWeb.WHOIS('adc.sh')
    ok(/Domain Name/.test(res))
  },
}

export default T