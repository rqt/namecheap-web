import NamecheapWeb from '../src'

(async () => {
  try {
    const res = await NamecheapWeb.SANDBOX_COUPON()
    console.log(res)
  } catch ({ message }) {
    console.error(message)
  }
})()