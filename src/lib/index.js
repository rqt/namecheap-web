import mismatch from 'mismatch'
import { askSingle } from 'reloquent'
import { c } from 'erte'

export const extractOptions = (body) => {
  const res = mismatch(
    /<option value="(\d+-phone)">(.+?(\d\d\d))<\/option>/g,
    body,
    ['value', 'title', 'last']
  )
  return res
}

export const extractFormState = (body) => {
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

export const askForNumber = async (options, phone) => {
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


export const extractXsrf = (body) => {
  const re = /<input type="hidden" id="x-ncpl-csrfvalue" value="(.+?)"/
  const res = re.exec(body)
  if (!res) throw new Error('Could not find the x-ncpl-csrfvalue token on the page.')
  const [, token] = res
  return token
}