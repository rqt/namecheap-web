/* yarn example/ */
import NamecheapWeb from '../src'
import bosom from 'bosom'

(async () => {
  try {
    // 0. Read stored username and password from a local file.
    const { username, password } = await bosom('.auth.json')
    const nw = new NamecheapWeb({
      readSession: true, // save cookies in a file.
    })
    // 1. Authenticate and create a session.
    await nw.auth(username, password)

    // 2. Read white-listed IPs.
    const ips = await nw.getWhitelistedIPList()
    console.log(JSON.stringify(ips[0], null, 2))

    // 3. Whitelist a new IP.
    const ip = await NamecheapWeb.LOOKUP_IP()
    await nw.whitelistIP(ip, 'example')

    // 4. Remove white-listed IP.
    await nw.removeWhitelistedIP('example')
  } catch ({ message }) {
    console.error(message)
  }
})()