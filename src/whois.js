import { Session } from 'rqt'

const whois = async (domain, USER_AGENT) => {
  const s = new Session({
    host: 'https://www.namecheap.com/domains/whois',
    headers: {
      'User-Agent': USER_AGENT,
    },
  })
  const res = await s.rqt(`/results.aspx?domain=${domain}`)
  const re = /var url = "\/domains\/whois\/whois-ajax\.aspx\?(.+?)"/
  const reRes = re.exec(res)
  if (!reRes) throw new Error('Could not find the AJAX request URL.')
  const [, params] = reRes
  const res2 = await s.rqt(`/whois-ajax.aspx?${params}`)
  const re2 = /<pre id=".+?_whoisResultText" class="wrapped whois">([\s\S]+)<\/pre>/
  const re2Res = re2.exec(res2)
  if (!re2Res) throw new Error('Could not extract data.')
  const [, w] = re2Res
  return w
}

export default whois
