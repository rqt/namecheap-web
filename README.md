<a rel="nofollow" href="https://affiliate.namecheap.com/?affId=70782"><img src="http://files.namecheap.com/graphics/linkus/728x90-1.gif" width="728" height="90" border="0" alt="Namecheap.com"></a>

# @rqt/namecheap-web

[![npm version](https://badge.fury.io/js/%40rqt%2Fnamecheap-web.svg)](https://npmjs.org/package/@rqt/namecheap-web)

`@rqt/namecheap-web` is an API to [`namecheap.com`](https://affiliate.namecheap.com/?affId=70782) via the web interface, with an ability to log in using 2-factor Auth and check Whois.

```sh
yarn add -E @rqt/namecheap-web
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`constructor(options?: Options): NamecheapWeb`](#constructoroptions-options-namecheapweb)
    * [`Options`](#type-options)
  * [`async auth(username: string, password: string, phone?: string)`](#async-authusername-stringpassword-stringphone-string-void)
  * [`async static LOOKUP_IP(): string`](#async-static-lookup_ip-string)
  * [`async getWhitelistedIPList(username: string, password: string, phone?: string): WhitelistedIP[]`](#async-getwhitelistediplistusername-stringpassword-stringphone-string-whitelistedip)
    * [`WhitelistedIP`](#type-whitelistedip)
  * [`async whitelistIP(ip: string, name?: string)`](#async-whitelistipip-stringname-string-void)
  * [`async removeWhitelistedIP(name: string)`](#async-removewhitelistedipname-string-void)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default class:

```js
import NamecheapWeb from '@rqt/namecheap-web'
```

### `constructor(`<br/>&nbsp;&nbsp;`options?: Options,`<br/>`): NamecheapWeb`

Create a new instance of the _NamecheapWeb_ class. The `sandbox` version can be specified in the options. To remember the session cookies on the local filesystem, the `readSession` parameter can be passed. On the production version, the session expires after 20 minutes, but can be renewed after 10 minutes of using an existing session.

__<a name="type-options">`Options`</a>__: Options for the web client.

|    Name     |   Type    |                           Description                           |        Default        |
| ----------- | --------- | --------------------------------------------------------------- | --------------------- |
| sandbox     | _boolean_ | Whether to use the `sandbox` version.                           | `false`               |
| readSession | _boolean_ | Read and store the cookies for the session from the local file. | `false`               |
| sessionFile | _string_  | If reading session, indicates the file where to store cookies.  | `.namecheap-web.json` |

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
    console.log(JSON.stringify(ips, null, 2))

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

```json5
[
  {
    "Name": "expensive 2018-7-23 18-13-04",
    "IpAddress": "2.219.56.166",
    "ModifyDate": "2018-07-23T17:13:05.200Z"
  },
  {
    "Name": "82.132.224.85",
    "IpAddress": "82.132.224.85",
    "ModifyDate": "2018-06-14T10:09:21.750Z"
  },
  {
    "Name": "expensive 2018-6-18 19-38-19",
    "IpAddress": "82.132.225.170",
    "ModifyDate": "2018-06-18T18:38:20.083Z"
  },
  {
    "Name": "expensive 2018-6-22 19-17-06",
    "IpAddress": "82.132.246.100",
    "ModifyDate": "2018-06-22T18:17:06.770Z"
  },
  {
    "Name": "expensive 2018-6-22 11-54-37",
    "IpAddress": "82.132.247.173",
    "ModifyDate": "2018-06-22T10:54:37.913Z"
  }
]
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true" width="15"></a></p>

### `async auth(`<br/>&nbsp;&nbsp;`username: string,`<br/>&nbsp;&nbsp;`password: string,`<br/>&nbsp;&nbsp;`phone?: string,`<br/>`): void`

Authenticate the app and obtain the cookies. If 2-factor authentication is enabled, it will also be carried out. The `phone` argument can be passed which is the last 3 digits of the phone used to receive the confirmation text. If it is not passed, a question will be asked via the CLI. The code should be then entered in the CLI as well.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true" width="15"></a></p>

### `async static LOOKUP_IP(): string`

Get the public IP address using [https://api.ipify.org](https://api.ipify.org).

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true" width="15"></a></p>

### `async getWhitelistedIPList(`<br/>&nbsp;&nbsp;`username: string,`<br/>&nbsp;&nbsp;`password: string,`<br/>&nbsp;&nbsp;`phone?: string,`<br/>`): WhitelistedIP[]`

Get a list of white-listed IP addresses which can make API calls. The maximum of 20 IP addresses is allowed.

__<a name="type-whitelistedip">`WhitelistedIP`</a>__: A white-listed IP which can be used for API calls.

|      Name       |   Type   |      Description       |
| --------------- | -------- | ---------------------- |
| __Name*__       | _string_ | The name of the IP.    |
| __IpAddress*__  | _string_ | The IP address.        |
| __ModifyDate*__ | _Date_   | The modification date. |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true" width="15"></a></p>

### `async whitelistIP(`<br/>&nbsp;&nbsp;`ip: string,`<br/>&nbsp;&nbsp;`name?: string,`<br/>`): void`

Add an IP address to the white-listed IPs. If name is not given, it is automatically generated as `rqt {date}`

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true" width="15"></a></p>

### `async removeWhitelistedIP(`<br/>&nbsp;&nbsp;`name: string,`<br/>`): void`

Remove the IP from the white-listed IPs by its name.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true" width="15"></a></p>


## Copyright

(c) [Rqt][1] 2018

[1]: https://rqt.biz

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>