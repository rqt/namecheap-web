export {}
/* typal types/ips.xml noSuppress */
/**
 * @typedef {_namecheap.WhitelistedIP} WhitelistedIP `＠record` A white-listed IP which can be used for API calls.
 */
/**
 * @typedef {Object} _namecheap.WhitelistedIP `＠record` A white-listed IP which can be used for API calls.
 * @prop {string} Name The name of the IP.
 * @prop {string} IpAddress The IP address.
 * @prop {!Date} ModifyDate The modification date.
 */

/* typal types/options.xml noSuppress */
/**
 * @typedef {_namecheap.WebOptions} WebOptions `＠record` Options for the web client.
 */
/**
 * @typedef {Object} _namecheap.WebOptions `＠record` Options for the web client.
 * @prop {boolean} [sandbox=false] Whether to use the `sandbox` version. Default `false`.
 * @prop {boolean} [readSession=false] Read and store the cookies for the session from the local file. Default `false`.
 * @prop {string} [sessionFile=".namecheap-web.json"] If reading session, indicates the file where to store cookies. Default `.namecheap-web.json`.
 */

/* typal types/result.xml noSuppress */
/**
 * @typedef {_namecheap.AjaxResult} AjaxResult
 */
/**
 * @typedef {Object} _namecheap.AjaxResult
 * @prop {boolean} __isError
 * @prop {string} Message
 * @prop {!Array<{ Message: string }>} Errors
 * @prop {!Array<string>} Warnings
 * @prop {boolean} Success
 * @prop {!Object<string, ?>} Data
 * @prop {string} __type
 */
