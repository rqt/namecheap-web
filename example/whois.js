import NamecheapWeb from '../src'

(async () => {
  try {
    const res = await NamecheapWeb.WHOIS('test.org')
    console.log(res)
  } catch ({ message }) {
    console.error(message)
  }
})()