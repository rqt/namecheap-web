import rqt from 'rqt'

const coupon = async (USER_AGENT) => {
  const s = await rqt('https://www.namecheap.com/promos/coupons/', {
    headers: {
      'User-Agent': USER_AGENT,
    },
  })
  const res = /<small>Coupon Code<\/small>\s+.+couponCode">(.+)<\/span>/.exec(s)
  if (!res) throw new Error('Could not find the coupon code.')
  return res[1]
}

export default coupon