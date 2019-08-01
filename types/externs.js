/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml externs */
/** @const */
var _namecheap = {}
/**
 * Performs namecheap.com operations via the web interface.
 * @param {_namecheap.Options} options Options for the web client.
 * @interface
 */
_namecheap.NamecheapWeb = function(options) {}
/**
 * Authenticate the app and obtain the cookies.
 * @param {string} username The username to log in with.
 * @param {string} password The password to enter.
 * @param {string=} [phone] The phone number to select for 2-factor auth.
 * @param {boolean=} [force] Try to log in even if session exists.
 * @return {!Promise}
 */
_namecheap.NamecheapWeb.prototype.auth = function(username, password, phone, force) {}
/**
 * Get a list of white-listed IP addresses which can make API calls.
 * @return {!Promise<!Array<!namecheap.WhitelistedIP>>}
 */
_namecheap.NamecheapWeb.prototype.getWhitelistedIPList = function() {}
/**
 * Add an IP address to the white-listed IPs.
 * @param {string} ip The IP to add.
 * @param {string=} [name] The name to save the IP as. If not given, it is automatically generated as _rqt {date}_.
 * @return {!Promise}
 */
_namecheap.NamecheapWeb.prototype.whitelistIP = function(ip, name) {}
/**
 * Remove the IP from the white-listed IPs by its name.
 * @param {string} name The name name of the saved IP to remove.
 * @return {!Promise}
 */
_namecheap.NamecheapWeb.prototype.removeWhitelistedIP = function(name) {}
/**
 * Return the whois information about the domain.
 * @param {string} domain The domain name to get information about.
 * @return {!Promise<string>}
 */
_namecheap.NamecheapWeb.WHOIS = function(domain) {}
/**
 * Return the coupon from the https://www.namecheap.com/promos/coupons/ page.
 * @return {!Promise<string>}
 */
_namecheap.NamecheapWeb.COUPON = function() {}
/**
 * Return the coupon from the https://www.sandbox.namecheap.com/promos/coupons/ page.
 * @return {!Promise<string>}
 */
_namecheap.NamecheapWeb.SANDBOX_COUPON = function() {}
/**
 * Get the public IP address using https://api.ipify.org.
 * @return {!Promise<string>}
 */
_namecheap.NamecheapWeb.LOOKUP_IP = function() {}

/* typal types/ips.xml externs */
/**
 * A white-listed IP which can be used for API calls.
 * @record
 */
_namecheap.WhitelistedIP
/**
 * The name of the IP.
 * @type {string}
 */
_namecheap.WhitelistedIP.prototype.Name
/**
 * The IP address.
 * @type {string}
 */
_namecheap.WhitelistedIP.prototype.IpAddress
/**
 * The modification date.
 * @type {!Date}
 */
_namecheap.WhitelistedIP.prototype.ModifyDate

/* typal types/options.xml externs */
/**
 * Options for the web client.
 * @record
 */
_namecheap.Options
/**
 * Whether to use the `sandbox` version.
 * @type {boolean|undefined}
 */
_namecheap.Options.prototype.sandbox
/**
 * Read and store the cookies for the session from the local file.
 * @type {boolean|undefined}
 */
_namecheap.Options.prototype.readSession
/**
 * If reading session, indicates the file where to store cookies. Default `.namecheap-web.json`.
 * @type {string|undefined}
 */
_namecheap.Options.prototype.sessionFile

/* typal types/result.xml externs */
/**
 * @typedef {{ __isError: boolean, Message: string, Errors: !Array<{ Message: string }>, Warnings: !Array<string>, Success: boolean, Data: !Object<string, ?>, __type: string }}
 */
_namecheap.AjaxResult
