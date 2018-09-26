let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
const { askSingle } = require('reloquent');
const { c } = require('erte');

       const extractOptions = (body) => {
  const res = mismatch(
    /<option value="(\d+-phone)">(.+?(\d\d\d))<\/option>/g,
    body,
    ['value', 'title', 'last']
  )
  return res
}

       const extractFormState = (body) => {
  const res = mismatch(
    /<input type="hidden" name="(.+?)" id="__\w+" value="(.*?)" \/>/g,
    body,
    ['name', 'value'],
  )
  const r = res.reduce((acc, { name, value }) => {
    return {
      ...acc,
      [name]: value,
    }
  }, {})
  return r
}

const mapPhoneOptions = o => {
  const r = /(.+?)(\d\d\d)$/.exec(o)
  if (!r) return o
  const [, g, n] = r
  const gr = c(g, 'grey')
  const co = `${gr}${n}`
  return co
}

const getColorOptions = (options) => {
  const n = options
    .map(({ title }) => ` ${title}`)
    .map(mapPhoneOptions)
    .join('\n')
  return n
}

       const askForNumber = async (options, phone) => {
  const s = getColorOptions(options)
  const text = `Which phone number to use for 2 factor auth
${s}
enter last 3 digits`

  const answer = await askSingle({
    text,
    async getDefault() {
      return phone || options[0].last
    },
    validation(a) {
      const p = options.some(({ last }) => last == a)
      if (!p) {
        throw new Error('Unknown number entered.')
      }
    },
  })

  const { value } = options.find(({ last }) => last == answer)
  return value
}


       const extractXsrf = (body) => {
  const re = /<input type="hidden" id="x-ncpl-csrfvalue" value="(.+?)"/
  const res = re.exec(body)
  if (!res) throw new Error('Could not find the x-ncpl-csrfvalue token on the page.')
  const [, token] = res
  return token
}

/**
 * Single level deep equal.
 */
       const deepEqual = (o1, o2) => {
  const r = Object.keys(o1).reduce((acc, key) => {
    const val = o1[key]
    const val2 = o2[key]
    if (!(key in o2)) {
      const k = `-  ${key}`
      const s = c(`${k}: ${val}`, 'red')
      return [...acc, s]
    } else if (val !== val2) {
      const k = `-  ${key}`
      const k2 = `+  ${key}`
      const s = c(`${k}: ${val}`, 'red')
      const s2 = c(`${k2}: ${val2}`, 'green')
      return [...acc, s, s2]
    }
    return acc
  }, [])
  const r2 = Object.keys(o2).reduce((acc, key) => {
    const val = o1[key]
    if (!(key in o1)) {
      const k = `+  ${key}`
      const s = c(`${k}: ${val}`, 'green')
      return [...acc, s]
    }
    return acc
  }, r)
  if (r2.length) {
    const m = `
{
${r2.join('\n')}
}`.trim()
    throw new Error(m)
  }
}

module.exports.extractOptions = extractOptions
module.exports.extractFormState = extractFormState
module.exports.askForNumber = askForNumber
module.exports.extractXsrf = extractXsrf
module.exports.deepEqual = deepEqual
//# sourceMappingURL=index.js.map