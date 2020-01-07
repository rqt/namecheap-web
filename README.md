[![namecheap](https://raw.githubusercontent.com/rqt/namecheap-web/HEAD/images/nc.gif)](https://nameexpensive.com)

# @rqt/namecheap-web

[![npm version](https://badge.fury.io/js/%40rqt%2Fnamecheap-web.svg)](https://www.npmjs.com/package/@rqt/namecheap-web)

`@rqt/namecheap-web` is an API to [`namecheap.com`](https://nameexpensive.com) via the web interface, with an ability to log in using 2-factor Auth, check Whois and retrieve a coupon code.

<a href="https://github.com/artdecocode/expensive"><img src="https://raw.github.com/rqt/namecheap-web/master/images/Expensive.svg?sanitize=true" align="left"></a>The web API is currently used in the _Expensive_ package to authenticate and white-list IP addresses. This is useful for dynamic-IP holders. Because the API implemented with `gzip` compression, the amount of traffic is minimized as well, helping to save data on mobile networks.

```sh
yarn add @rqt/namecheap-web
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`constructor(options?: WebOptions): NamecheapWeb`](#constructoroptions-weboptions-namecheapweb)
  * [`WebOptions`](#type-weboptions)
- [`async auth(username: string, password: string, phone?: string)`](#async-authusername-stringpassword-stringphone-string-void)
- [`async static LOOKUP_IP(): string`](#async-static-lookup_ip-string)
- [`async static WHOIS(domain): string`](#async-static-whoisdomain-string)
- [`async static COUPON(): string`](#async-static-coupon-string)
- [`async static SANDBOX_COUPON(): string`](#async-static-sandbox_coupon-string)
- [`async getWhitelistedIPList(): !Promise<!Array<!_namecheap.WhitelistedIP>>`](#async-getwhitelistediplist-promisearray_namecheapwhitelistedip)
  * [`WhitelistedIP`](#type-whitelistedip)
- [`async whitelistIP(ip: string, name=: string): !Promise`](#async-whitelistipip-stringname-string-promise)
- [`async removeWhitelistedIP(name: string): !Promise`](#async-removewhitelistedipname-string-promise)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default class:

```js
import NamecheapWeb from '@rqt/namecheap-web'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code><ins>constructor</ins>(</code><sub><br/>&nbsp;&nbsp;`options?: WebOptions,`<br/></sub><code>): <i>NamecheapWeb</i></code>

Create a new instance of the _NamecheapWeb_ class. The `sandbox` version can be specified in the options. To remember the session cookies on the local filesystem, the `readSession` parameter can be passed. On the production version, the session expires after 20 minutes, but can be renewed after 10 minutes of using an existing session.

__<a name="type-weboptions">`WebOptions`</a>__: Options for the web client.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
  <th>Default</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center">sandbox</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>false</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Whether to use the <code>sandbox</code> version.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">readSession</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>false</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Read and store the cookies for the session from the local file.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">sessionFile</td>
  <td><em>string</em></td>
  <td rowSpan="3"><code>.namecheap-web.json</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   If reading session, indicates the file where to store cookies.
  </td>
 </tr>
</table>

```js
/* yarn example/ */
import NamecheapWeb from '@rqt/namecheap-web'
import bosom from 'bosom'

(async () => {
  try {
    // 0. Read stored username and password from a local file.
    const { username, password } = await bosom('.auth-sandbox.json')
    const nw = new NamecheapWeb({
      sandbox: true,
      readSession: true, // save cookies in a file.
    })
    // 1. Authenticate and create a session.
    await nw.auth(username, password)

    // 2. Read white-listed IPs.
    const ips = await nw.getWhitelistedIPList()
    console.log(JSON.stringify(ips[0], null, 2))

    // 3. Whitelist a new IP.
    const ip = await NamecheapWeb.LOOKUP_IP()
    await nw.whitelistIP(ip, 'example')

    // 4. Remove white-listed IP.
    await nw.removeWhitelistedIP('example')
  } catch ({ message }) {
    console.error(message)
  }
})()
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## <code>async <ins>auth</ins>(</code><sub><br/>&nbsp;&nbsp;`username: string,`<br/>&nbsp;&nbsp;`password: string,`<br/>&nbsp;&nbsp;`phone?: string,`<br/></sub><code>): <i>void</i></code>

Authenticate the app and obtain the cookies. If 2-factor authentication is enabled, it will also be carried out. The `phone` argument can be passed which is the last 3 digits of the phone used to receive the confirmation text. If it is not passed, a question will be asked via the CLI. The code should be then entered in the CLI as well.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## `async static LOOKUP_IP(): string`

Get the public IP address using [https://api.ipify.org](https://api.ipify.org).

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>

## `async static WHOIS(domain): string`

Return WHOIS data for the domain.

```js
import NamecheapWeb from '@rqt/namecheap-web'

(async () => {
  try {
    const res = await NamecheapWeb.WHOIS('test.org')
    console.log(res)
  } catch ({ message }) {
    console.error(message)
  }
})()
```

<details>
<summary>Show whois data</summary>

```
Domain Name: test.org
Registry Domain ID: D380528-LROR
Registrar WHOIS Server: whois.psi-usa.info
Registrar URL: https://www.psi-usa.info
Updated Date: 2019-09-14T07:09:46Z
Creation Date: 1997-07-27T04:00:00Z
Registrar Registration Expiration Date: 2020-10-15T16:17:16Z
Registrar: PSI-USA, Inc. dba Domain Robot
Registrar IANA ID: 151
Registrar Abuse Contact Email: domain-abuse@psi-usa.info
Registrar Abuse Contact Phone: +49.94159559482
Domain Status: clientTransferProhibited https://www.icann.org/epp#clientTransferProhibited
Registry Registrant ID: REDACTED FOR PRIVACY
Registrant Name: REDACTED FOR PRIVACY
Registrant Organization: TMT Teleservice GmbH & Co.KG
Registrant Street: REDACTED FOR PRIVACY
Registrant City: REDACTED FOR PRIVACY
Registrant State/Province: Bayern
Registrant Postal Code: REDACTED FOR PRIVACY
Registrant Country: DE
Registrant Phone: REDACTED FOR PRIVACY
Registrant Phone Ext: REDACTED FOR PRIVACY
Registrant Fax: REDACTED FOR PRIVACY
Registrant Fax Ext: REDACTED FOR PRIVACY
Registrant Email: https://contact.domain-robot.org/test.org
Registry Admin ID: REDACTED FOR PRIVACY
Admin Name: REDACTED FOR PRIVACY
Admin Organization: REDACTED FOR PRIVACY
Admin Street: REDACTED FOR PRIVACY
Admin City: REDACTED FOR PRIVACY
Admin State/Province: REDACTED FOR PRIVACY
Admin Postal Code: REDACTED FOR PRIVACY
Admin Country: REDACTED FOR PRIVACY
Admin Phone: REDACTED FOR PRIVACY
Admin Phone Ext: REDACTED FOR PRIVACY
Admin Fax: REDACTED FOR PRIVACY
Admin Fax Ext: REDACTED FOR PRIVACY
Admin Email: https://contact.domain-robot.org/test.org
Registry Tech ID: REDACTED FOR PRIVACY
Tech Name: REDACTED FOR PRIVACY
Tech Organization: REDACTED FOR PRIVACY
Tech Street: REDACTED FOR PRIVACY
Tech City: REDACTED FOR PRIVACY
Tech State/Province: REDACTED FOR PRIVACY
Tech Postal Code: REDACTED FOR PRIVACY
Tech Country: REDACTED FOR PRIVACY
Tech Phone: REDACTED FOR PRIVACY
Tech Phone Ext: REDACTED FOR PRIVACY
Tech Fax: REDACTED FOR PRIVACY
Tech Fax Ext: REDACTED FOR PRIVACY
Tech Email: https://contact.domain-robot.org/test.org
Name Server: ns0.tmt.de
Name Server: ns2.tmt.de
Name Server: ns3.tmt.de
Name Server: ns4.tmt.de
Name Server: ns1.tmt.de
DNSSEC: unsigned
URL of the ICANN WHOIS Data Problem Reporting System: https://wdprs.internic.net/
>>> Last update of WHOIS database: 2020-01-07T22:34:28Z <<<

For more information on Whois status codes, please visit https://www.icann.org/epp


# Terms and conditions:
#
# The data in the WHOIS database of PSI-USA, Inc. is provided by
# PSI-USA, Inc. for information purposes, and to assist persons in
# obtaining information about or related to a domain name registration
# record.  PSI-USA, Inc. does not guarantee its accuracy.  By submitting
# a WHOIS query, you agree that you will use this data only for lawful
# purposes and that, under no circumstances, you will use this data to
#  (1) allow, enable, or otherwise support the transmission of mass
#      unsolicited, commercial advertising or solicitations via E-mail
#      (spam); or
#  (2) enable high volume, automated, electronic processes that apply to
#      PSI-USA, Inc. or its systems.
# PSI-USA, Inc. reserves the right to modify these terms at any time.
# By submitting this query, you agree to abide by this policy.
#
```
</details>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>

## `async static COUPON(): string`

Returns this month's coupon from the https://www.namecheap.com/promos/coupons/ page.

```js
/* yarn example/whois.js */
import NamecheapWeb from '@rqt/namecheap-web'

(async () => {
  try {
    const res = await NamecheapWeb.COUPON()
    console.log(res)
  } catch ({ message }) {
    console.error(message)
  }
})()
```
```
TLDEALZ01
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/6.svg?sanitize=true">
</a></p>

## `async static SANDBOX_COUPON(): string`

Returns this month's coupon from the https://www.sandbox.namecheap.com/promos/coupons/ page.

```js
import NamecheapWeb from '@rqt/namecheap-web'

(async () => {
  try {
    const res = await NamecheapWeb.SANDBOX_COUPON()
    console.log(res)
  } catch ({ message }) {
    console.error(message)
  }
})()
```
```
TLDEALZ01
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/7.svg?sanitize=true">
</a></p>

## <code>async <ins>getWhitelistedIPList</ins>(): <i>!Promise<!Array<!_namecheap.WhitelistedIP>></i></code>

Get a list of white-listed IP addresses which can make API calls. The maximum of 20 IP addresses is allowed.

__<a name="type-whitelistedip">`WhitelistedIP`</a>__: A white-listed IP which can be used for API calls.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><strong>Name*</strong></td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The name of the IP.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><strong>IpAddress*</strong></td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The IP address.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><strong>ModifyDate*</strong></td>
  <td><em>!Date</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The modification date.
  </td>
 </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/8.svg?sanitize=true">
</a></p>

## <code>async <ins>whitelistIP</ins>(</code><sub><br/>&nbsp;&nbsp;`ip: string,`<br/>&nbsp;&nbsp;`name=: string,`<br/></sub><code>): <i>!Promise</i></code>

Add an IP address to the white-listed IPs.

 - <kbd><strong>ip*</strong></kbd> <em>`string`</em>: The IP to add.
 - <kbd>name</kbd> <em>`string`</em> (optional): The name to save the IP as. If not given, it is automatically generated as _rqt {date}_.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/9.svg?sanitize=true">
</a></p>

## <code>async <ins>removeWhitelistedIP</ins>(</code><sub><br/>&nbsp;&nbsp;`name: string,`<br/></sub><code>): <i>!Promise</i></code>

Remove the IP from the white-listed IPs by its name.

 - <kbd><strong>name*</strong></kbd> <em>`string`</em>: The name of the saved IP to remove.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/10.svg?sanitize=true">
</a></p>


## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://rqt.biz">Rqt</a> 2020</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>