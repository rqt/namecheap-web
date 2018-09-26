const { debuglog } = require('util');

const LOG = debuglog('@rqt/namecheap-web')

/**
 * An API to namecheap.com via the web interface, with an ability to log in using 2-factor Auth and check Whois.
 * @param {Config} config Options for the program.
 * @param {boolean} config.shouldRun A boolean option.
 */
               async function namecheapWeb(config) {
  const {
    type,
  } = config
  LOG('@rqt/namecheap-web called with %s', type)
  return type
}

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {boolean} shouldRun A boolean option.
 */


module.exports = namecheapWeb
//# sourceMappingURL=index.js.map