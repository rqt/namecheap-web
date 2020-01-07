import { Session } from 'rqt'

/**
 * @param {string} domain
 * @param {string} USER_AGENT
 */
const whois = async (domain, USER_AGENT) => {
  if (!domain) throw new Error('Please specify the domain.')
  const s = new Session({
    host: 'https://www.namecheap.com',
    headers: {
      'User-Agent': USER_AGENT,
    },
  })
  const res2 = await s.rqt(`/domains/whoislookup-api/${domain}`)
  return res2
}

export default whois
