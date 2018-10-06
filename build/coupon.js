let rqt = require('rqt'); if (rqt && rqt.__esModule) rqt = rqt.default;

const coupon = async (USER_AGENT, sandbox) => {
  const h = sandbox ? 'sandbox.' : ''
  const s = await rqt(`https://www.${h}namecheap.com/promos/coupons/`, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  })
  const res = /<small>Coupon Code<\/small>\s+.+couponCode">(.+)<\/span>/.exec(s)
  if (!res) throw new Error('Could not find the coupon code.')
  return res[1]
}

module.exports=coupon