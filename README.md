# @rqt/namecheap-web

[![npm version](https://badge.fury.io/js/@rqt/namecheap-web.svg)](https://npmjs.org/package/@rqt/namecheap-web)

`@rqt/namecheap-web` is An API to namecheap.com via the web interface, with an ability to log in using 2-factor Auth and check Whois.

```sh
yarn add -E @rqt/namecheap-web
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`namecheapWeb(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
- [TODO](#todo)
- [Copyright](#copyright)

## API

The package is available by importing its default function:

```js
import namecheapWeb from '@rqt/namecheap-web'
```

### `namecheapWeb(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

```js
/* yarn example/ */
import namecheapWeb from '@rqt/namecheap-web'

(async () => {
  await namecheapWeb()
})()
```

## TODO

- [ ] Add a new item to the todo list.

## Copyright

(c) [Rqt][1] 2018

[1]: https://rqt.biz
