import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import namecheapWeb from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof namecheapWeb, 'function')
  },
  async 'calls package without error'() {
    await namecheapWeb()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await namecheapWeb({
      type: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T