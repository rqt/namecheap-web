/* yarn example/whois.js */
import NamecheapWeb from '../src'

(async () => {
  try {
    const res = await NamecheapWeb.WHOIS('demimonde.cc')
    console.log(res)
  } catch ({ message }) {
    console.error(message)
  }
})()