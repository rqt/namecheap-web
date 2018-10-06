/* yarn example/whois.js */
import NamecheapWeb from '../src'

(async () => {
  try {
    const res = await NamecheapWeb.COUPON()
    console.log(res)
  } catch ({ message }) {
    console.error(message)
  }
})()