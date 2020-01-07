import rqt from 'rqt'

/**
 * @param {string} USER_AGENT
 * @param {boolean} [sandbox=false]
 */
const coupon = async (USER_AGENT, sandbox = false) => {
  const h = sandbox ? 'sandbox.' : ''
  const s = await rqt(`https://www.${h}namecheap.com/promos/coupons/`, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  })
  const res = /"couponCode":"(.+?)"/.exec(s)
  if (!res) throw new Error('Could not find the coupon code.')
  return res[1]
}

export default coupon