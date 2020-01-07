## API

The package is available by importing its default class:

```js
import NamecheapWeb from '@rqt/namecheap-web'
```

%~%

<method name="NamecheapWeb.constructor">types/index.xml</method>

To remember the session cookies on the local filesystem, the `readSession` parameter can be passed. On the production version, the session expires after 20 minutes, but can be renewed after 10 minutes of using an existing session.

<typedef narrow>types/options.xml</typedef>

%EXAMPLE: example/example.js, ../src => @rqt/namecheap-web%

<!-- %FORK-json5 example example/example% -->

%~%