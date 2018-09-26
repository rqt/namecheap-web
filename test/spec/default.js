import { equal } from 'zoroaster/assert'
import bosom from 'bosom'
import Context from '../context'
import NamecheapWeb from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof NamecheapWeb, 'function')
  },
  async 'can get a session'() {

  },
  // async 'gets a link to the fixture'({ FIXTURE }) {
  //   const res = await namecheapWeb({
  //     type: FIXTURE,
  //   })
  //   ok(res, FIXTURE)
  // },
}

export default T