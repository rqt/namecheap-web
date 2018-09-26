## API

The package is available by importing its default class:

```js
import NamecheapWeb from '@rqt/namecheap-web'
```

```### constructor => NamecheapWeb
[
  ["options?", "Options"]
]
```

Create a new instance of the _NamecheapWeb_ class. The `sandbox` version can be specified in the options. To remember the session cookies on the local filesystem, the `readSession` parameter can be passed. On the production version, the session expires after 20 minutes, but can be renewed after 10 minutes of using an existing session.

%TYPEDEF types/options.xml%

%EXAMPLE: example/example.js, ../src => @rqt/namecheap-web%

%FORK-json5 example example/example%

%~ width="15"%