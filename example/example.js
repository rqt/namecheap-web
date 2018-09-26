/* yarn example/ */
import NamecheapWeb from '../src'
import bosom from 'bosom'

(async () => {
  const nw = new NamecheapWeb({
    readSession: true,
  })
  const { username, password } = await bosom('.auth.json')
  await nw.auth(username, password)
  debugger
})()