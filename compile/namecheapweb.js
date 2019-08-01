#!/usr/bin/env node
             
const util = require('util');
const fs = require('fs');
const stream = require('stream');
const os = require('os');
const https = require('https');
const http = require('http');
const url = require('url');
const zlib = require('zlib');
const assert = require('assert');
const readline = require('readline');             
const {debuglog:r} = util;
const {createReadStream:u, createWriteStream:v} = fs;
const {Writable:aa} = stream;
const w = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ba = (a, b = !1) => w(a, 2 + (b ? 1 : 0)), y = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:ca} = os;
const z = /\s+at.*(?:\(|\s)(.*)\)?/, da = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ea = ca(), A = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, e = new RegExp(da.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(z);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(z, (f, g) => f.replace(g, g.replace(ea, "~"))) : d).join("\n");
};
function fa(a, b, c = !1) {
  return function(e) {
    var d = y(arguments), {stack:f} = Error();
    const g = w(f, 2, !0), l = (f = e instanceof Error) ? e.message : e;
    d = [`Error: ${l}`, ...null !== d && a === d || c ? [b] : [g, b]].join("\n");
    d = A(d);
    return Object.assign(f ? e : Error(), {message:l, stack:d});
  };
}
;function E(a) {
  var {stack:b} = Error();
  const c = y(arguments);
  b = ba(b, a);
  return fa(c, b, a);
}
;const ha = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class ia extends aa {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...e} = a || {}, {c:d = E(!0), proxyError:f} = a || {}, g = (l, k) => d(k);
    super(e);
    this.a = [];
    this.h = new Promise((l, k) => {
      this.on("finish", () => {
        let h;
        b ? h = Buffer.concat(this.a) : h = this.a.join("");
        l(h);
        this.a = [];
      });
      this.once("error", h => {
        if (-1 == h.stack.indexOf("\n")) {
          g`${h}`;
        } else {
          const t = A(h.stack);
          h.stack = t;
          f && g`${h}`;
        }
        k(h);
      });
      c && ha(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get f() {
    return this.h;
  }
}
const F = async(a, b = {}) => {
  ({f:a} = new ia({rs:a, ...b, c:E(!0)}));
  return await a;
};
async function ja(a) {
  a = u(a);
  return await F(a);
}
;async function ka(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = E(!0), e = v(a);
  await new Promise((d, f) => {
    e.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", d).end(b);
  });
}
;const la = r("bosom"), ma = async(a, b, c) => {
  const {replacer:e = null, space:d = null} = c;
  b = JSON.stringify(b, e, d);
  await ka(a, b);
}, G = async(a, b) => {
  var c = {};
  if (b) {
    return await ma(a, b, c);
  }
  la("Reading %s", a);
  a = await ja(a);
  return JSON.parse(a);
};
const {request:na} = https;
const {request:oa} = http;
const {parse:pa} = url;
const {createGunzip:qa} = zlib;
const ra = a => {
  ({"content-encoding":a} = a.headers);
  return "gzip" == a;
}, sa = (a, b, c = {}) => {
  const {justHeaders:e, binary:d, c:f = E(!0)} = c;
  let g, l, k, h, t = 0, x = 0;
  c = (new Promise((B, C) => {
    g = a(b, async m => {
      ({headers:l} = m);
      const {statusMessage:p, statusCode:q} = m;
      k = {statusMessage:p, statusCode:q};
      if (e) {
        m.destroy();
      } else {
        var n = ra(m);
        m.on("data", D => t += D.byteLength);
        m = n ? m.pipe(qa()) : m;
        h = await F(m, {binary:d});
        x = h.length;
      }
      B();
    }).on("error", m => {
      m = f(m);
      C(m);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:h, headers:l, ...k, o:t, byteLength:x, g:null}));
  return {s:g, f:c};
};
const ta = (a = {}) => Object.keys(a).reduce((b, c) => {
  const e = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(e)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), ua = async(a, b, {data:c, justHeaders:e, binary:d, c:f = E(!0)}) => {
  const {s:g, f:l} = sa(a, b, {justHeaders:e, binary:d, c:f});
  g.end(c);
  a = await l;
  ({"content-type":b = ""} = a.headers);
  if ((b = b.startsWith("application/json")) && a.body) {
    try {
      a.g = JSON.parse(a.body);
    } catch (k) {
      throw f = f(k), f.response = a.body, f;
    }
  }
  return a;
};
let H;
try {
  const {version:a, name:b} = require("../package.json");
  H = "@rqt/aqt" == b ? `@rqt/aqt/${a}` : `@rqt/aqt via ${b}/${a}`;
} catch (a) {
  H = "@aqt/rqt";
}
const va = r("aqt"), za = async(a, b = {}) => {
  const {data:c, type:e = "json", headers:d = {"User-Agent":`Mozilla/5.0 (Node.JS) ${H}`}, compress:f = !0, binary:g = !1, justHeaders:l = !1, method:k, timeout:h} = b;
  b = E(!0);
  const {hostname:t, protocol:x, port:B, path:C} = pa(a), m = "https:" === x ? na : oa, p = {hostname:t, port:B, path:C, headers:{...d}, timeout:h, method:k};
  if (c) {
    var q = e;
    var n = c;
    switch(q) {
      case "json":
        n = JSON.stringify(n);
        q = "application/json";
        break;
      case "form":
        n = ta(n), q = "application/x-www-form-urlencoded";
    }
    n = {data:n, contentType:q};
    ({data:q} = n);
    ({contentType:n} = n);
    p.method = k || "POST";
    "Content-Type" in p.headers || (p.headers["Content-Type"] = n);
    "Content-Length" in p.headers || (p.headers["Content-Length"] = Buffer.byteLength(q));
  }
  !f || "Accept-Encoding" in p.headers || (p.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:D, headers:wa, byteLength:N, statusCode:xa, statusMessage:ya, o:O, g:P} = await ua(m, p, {data:q, justHeaders:l, binary:g, c:b});
  va("%s %s B%s", a, N, `${N != O ? ` (raw ${O} B)` : ""}`);
  return {body:P ? P : D, headers:wa, statusCode:xa, statusMessage:ya};
};
async function I(a, b, c = {}) {
  {
    const {headers:e = {}, ...d} = c;
    c = {...d, headers:{...a.headers, ...e, Cookie:a.Cookie}};
  }
  b = await za(a.host ? `${a.host}${b}` : b, c);
  ({headers:c} = b);
  a.cookies = Aa(a.cookies, c);
  return b;
}
class J {
  constructor(a = {}) {
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
    this.cookies = {};
  }
  async rqt(a, b = {}) {
    ({body:a} = await I(this, a, b));
    return a;
  }
  async bqt(a, b = {}) {
    ({body:a} = await I(this, a, {...b, binary:!0}));
    return a;
  }
  async jqt(a, b = {}) {
    ({body:a} = await I(this, a, b));
    return a;
  }
  async aqt(a, b = {}) {
    return await I(this, a, b);
  }
  get Cookie() {
    return Ba(this.cookies);
  }
}
const Ba = a => Object.keys(a).reduce((b, c) => {
  c = `${c}=${a[c]}`;
  return [...b, c];
}, []).join("; "), Aa = (a, b) => {
  b = Ca(b);
  const c = {...a, ...b};
  return Object.keys(c).reduce((e, d) => {
    const f = c[d];
    return f ? {...e, [d]:f} : e;
  }, {});
}, Ca = ({"set-cookie":a = []} = {}) => a.reduce((b, c) => {
  {
    const e = /^(.+?)=(.*?);/.exec(c);
    if (!e) {
      throw Error(`Could not extract a cookie from ${c}`);
    }
    const [, d, f] = e;
    c = {[d]:f};
  }
  return {...b, ...c};
}, {});
const {ok:K} = assert;
const {createInterface:Da} = readline;
function Ea(a, b, c) {
  return setTimeout(() => {
    const e = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    e.stack = `Error: ${e.message}`;
    c(e);
  }, b);
}
function Fa(a, b) {
  let c;
  const e = new Promise((d, f) => {
    c = Ea(a, b, f);
  });
  return {timeout:c, f:e};
}
async function Ga(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {f:e, timeout:d} = Fa(c, b);
  try {
    return await Promise.race([a, e]);
  } finally {
    clearTimeout(d);
  }
}
;function Ha(a, b = {}) {
  const {timeout:c, password:e = !1, output:d = process.stdout, input:f = process.stdin, ...g} = b;
  b = Da({input:f, output:d, ...g});
  if (e) {
    const k = b.output;
    b._writeToOutput = h => {
      if (["\r\n", "\n", "\r"].includes(h)) {
        return k.write(h);
      }
      h = h.split(a);
      "2" == h.length ? (k.write(a), k.write("*".repeat(h[1].length))) : k.write("*");
    };
  }
  var l = new Promise(b.question.bind(b, a));
  l = c ? Ga(l, c, `reloquent: ${a}`) : l;
  b.promise = Ia(l, b);
  return b;
}
const Ia = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function Ja(a) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(b, c) => {
    b = await b;
    var e = a[c];
    switch(typeof e) {
      case "object":
        e = {...e};
        break;
      case "string":
        e = {text:e};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    e.text = `${e.text}${e.text.endsWith("?") ? "" : ":"} `;
    var d;
    if (e.defaultValue) {
      var f = e.defaultValue;
    }
    e.getDefault && (d = await e.getDefault());
    let g = f || "";
    f && d && f != d ? g = `\x1b[90m${f}\x1b[0m` : f && f == d && (g = "");
    f = d || "";
    ({promise:f} = Ha(`${e.text}${g ? `[${g}] ` : ""}${f ? `[${f}] ` : ""}`, {timeout:void 0, password:e.password}));
    d = await f || d || e.defaultValue;
    "function" == typeof e.validation && e.validation(d);
    "function" == typeof e.postProcess && (d = await e.postProcess(d));
    return {...b, [c]:d};
  }, {});
}
;async function L(a) {
  ({question:a} = await Ja({question:a}));
  return a;
}
;function M(a, b, c) {
  const e = [];
  b.replace(a, (d, ...f) => {
    d = f.slice(0, f.length - 2).reduce((g, l, k) => {
      k = c[k];
      if (!k || void 0 === l) {
        return g;
      }
      g[k] = l;
      return g;
    }, {});
    e.push(d);
  });
  return e;
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const Ka = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
function Q(a, b) {
  return (b = Ka[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const R = a => M(/<input type="hidden" name="(.+?)" id="__\w+" value="(.*?)" \/>/g, a, ["name", "value"]).reduce((b, {name:c, value:e}) => ({...b, [c]:e}), {}), La = a => {
  const b = /(.+?)(\d\d\d)$/.exec(a);
  if (!b) {
    return a;
  }
  const [, c, e] = b;
  return `${Q(c, "grey")}${e}`;
}, Ma = a => a.map(({title:b}) => ` ${b}`).map(La).join("\n"), Na = async(a, b) => {
  var c = `Which phone number to use for 2 factor auth
${Ma(a)}
enter last 3 digits`;
  const e = await L({text:c, async getDefault() {
    return b || a[0].last;
  }, validation(d) {
    if (!a.some(({last:f}) => f == d)) {
      throw Error("Unknown number entered.");
    }
  }});
  ({value:c} = a.find(({last:d}) => d == e));
  return c;
}, Oa = (a, b) => {
  var c = Object.keys(a).reduce((e, d) => {
    var f = a[d];
    const g = b[d];
    return d in b ? f !== g ? (f = Q(`${`-  ${d}`}: ${f}`, "red"), d = Q(`${`+  ${d}`}: ${g}`, "green"), [...e, f, d]) : e : (d = Q(`${`-  ${d}`}: ${f}`, "red"), [...e, d]);
  }, []);
  c = Object.keys(b).reduce((e, d) => {
    const f = a[d];
    return d in a ? e : (d = Q(`${`+  ${d}`}: ${f}`, "green"), [...e, d]);
  }, c);
  if (c.length) {
    throw Error(`
{
${c.join("\n")}
}`.trim());
  }
};
const Pa = r("@rqt/namecheap-web");
async function Qa(a) {
  const {SessionKey:b} = await a.session.jqt("/cart/ajax/SessionHandler.ashx");
  if (!b) {
    throw Error(`Could not acquire the session key from ${a.session.host}${"/cart/ajax/SessionHandler.ashx"}.`);
  }
  Pa("Obtained a session key %s", b);
  a.a = b;
}
async function Ra(a) {
  var b = await a.session.rqt(S.a);
  K(/Select Phone Contact Number/.test(b), 'Could not find the "Select Phone" section.');
  var c = M(/<option value="(\d+-phone)">(.+?(\d\d\d))<\/option>/g, b, ["value", "title", "last"]);
  K(c.length, "Could not find any numbers.");
  c = await Na(c, a.j);
  b = await a.session.rqt(S.a, {data:{...R(b), ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$ddlAuthorizeList:c, ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnSendVerification:"Proceed with Login"}, type:"form"});
  if (/You have reached the limit on the number.+/m.test(b)) {
    throw Error(b.match(/You have reached the limit on the number.+/m)[0]);
  }
  K(/We sent a message with the verification code/.test(b), "Could not find the code entry section.");
  await T(a, b);
}
async function Sa(a) {
  const {body:b, statusCode:c, headers:{location:e}} = await a.session.aqt(S.b, {data:{hidden_LoginPassword:"", LoginUserName:a.l, LoginPassword:a.i, sessionEncryptValue:a.a}, type:"form"});
  if (200 == c) {
    {
      const [, d] = /<strong class="title">Validation Error<\/strong>\s+<div>(.+?)<\/div>/.exec(b) || [];
      if (d) {
        throw Error(d.replace(/(<([^>]+)>)/ig, ""));
      }
    }
  } else {
    if (301 == c) {
      return a.session.cookies;
    }
  }
  if (302 == c && e.includes(S.a)) {
    await Ra(a);
  } else {
    throw Error(`Unknown result (status code ${c})`);
  }
  ({cookies:a} = a.session);
  return a;
}
async function T(a, b) {
  var [, c] = /Your 6-digit code begins with (\d)./.exec(b) || [];
  if (!c) {
    throw Error("Could not send the code.");
  }
  c = await L({text:`Security code (begins with ${c})`});
  const {body:e, headers:{location:d}} = await a.session.aqt(S.a, {data:{...R(b), ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$txtAuthVerification:c, ctl00$ctl00$ctl00$ctl00$base_content$web_base_content$home_content$page_content_left$CntrlAuthorization$btnVerify:"Submit Security Code"}, type:"form"});
  if (/Oops, you entered an invalid code.+/m.test(e)) {
    return console.log("Incorrect code, try again."), await T(a, e);
  }
  K(/Object moved/.test(e), "Expected to have been redirected after sign-in.");
  return d;
}
class S {
  constructor({username:a, password:b, m:c, host:e, userAgent:d} = {}) {
    e = new J({host:e, headers:{"User-Agent":d}});
    this.l = a;
    this.i = b;
    this.b = e;
    this.j = c;
    this.a = null;
  }
  static get b() {
    return "/myaccount/login-signup.aspx";
  }
  static get a() {
    return "/myaccount/twofa/secondauth.aspx";
  }
  get session() {
    return this.b;
  }
}
;const Ta = a => {
  if (a.__isError) {
    var b = Error(a.Message);
    Object.assign(b, a);
    throw b;
  }
  if (!a.Success) {
    throw b = a.Errors.map(({Message:c}) => c).join(", "), b = Error(b), b.__type = a.__type, b;
  }
};
function U(a) {
  return `/api/v1/ncpl/apiaccess/ui/${a}`;
}
async function Ua(a) {
  ({statusCode:a} = await a.session.aqt("/", {justHeaders:!0}));
  return 200 == a;
}
async function V(a) {
  a = await a.session.rqt(W.a);
  a = /<input type="hidden" id="x-ncpl-csrfvalue" value="(.+?)"/.exec(a);
  if (!a) {
    throw Error("Could not find the x-ncpl-csrfvalue token on the page.");
  }
  [, a] = a;
  return a;
}
async function Va(a, b, c = `@rqt ${(new Date).toLocaleString()}`.replace(/:/g, "-")) {
  const e = await V(a);
  await a.request(U("AddIpAddress"), e, {accountPassword:a.password, ipAddress:b, name:c});
}
async function Wa(a, b) {
  const c = await V(a);
  await a.request(U("RemoveIpAddresses"), c, {accountPassword:a.password, names:[b]});
}
async function Xa(a) {
  const b = await V(a);
  ({IpAddresses:a} = await a.request(U("GetWhitelistedIpAddresses"), b));
  return a.map(({Name:c, IpAddress:e, ModifyDate:d}) => ({Name:c, IpAddress:e, ModifyDate:new Date(`${d}Z`)}));
}
class W {
  constructor({cookies:a, host:b, userAgent:c, password:e}) {
    b = new J({host:b, headers:{"User-Agent":c}});
    b.cookies = a;
    this.a = b;
    this.password = e;
  }
  get session() {
    return this.a;
  }
  static get a() {
    return "/settings/tools/apiaccess/whitelisted-ips";
  }
  async request(a, b, c) {
    a = await this.session.jqt(a, {data:c, headers:{"x-ncpl-rcsrf":b}});
    Ta(a);
    ({Data:a} = a);
    return a;
  }
}
;const Ya = r("@rqt/namecheap-web"), Za = (a = !1) => `https://www.${a ? "sandbox." : ""}namecheap.com`, $a = (a = !1) => `https://ap.www.${a ? "sandbox." : ""}namecheap.com`;
async function X(a, b) {
  a.b.readSession && await ab(b, a.b.sessionFile);
}
async function Y(a, b) {
  const c = Z(a.a.session.cookies);
  b = await b;
  const e = Z(a.a.session.cookies);
  try {
    Oa(c, e);
  } catch ({message:d}) {
    Ya(d), await X(a, e);
  }
  return b;
}
class bb {
  constructor(a = {}) {
    const {sandbox:b, readSession:c, sessionFile:e = ".namecheap-web.json"} = a;
    this.b = {sandbox:b, readSession:c, sessionFile:e};
    this.a = null;
  }
  async auth(a, b, c, e = !1) {
    var d;
    this.b.readSession && !e && (d = await cb(this.b.sessionFile));
    d || (d = new S({username:a, password:b, host:Za(this.b.sandbox), m:c, userAgent:"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"}), await Qa(d), d = await Sa(d), await X(this, d));
    this.a = new W({cookies:d, password:b, host:$a(this.b.sandbox), userAgent:"Mozilla/5.0 (Node.js; @rqt/namecheap-web) https://github.com/rqt/namecheap-web"});
    d = await Y(this, Ua(this.a));
    if (!d && e) {
      throw Error("Could not authenticate.");
    }
    d || await this.auth(a, b, c, !0);
  }
  async whitelistIP(a, b) {
    await Y(this, Va(this.a, a, b));
  }
  async getWhitelistedIPList() {
    return await Y(this, Xa(this.a));
  }
  async removeWhitelistedIP(a) {
    await Y(this, Wa(this.a, a));
  }
}
const Z = a => {
  const b = ["x-ncpl-auth", ".ncauth", "SessionId", "U"];
  return Object.keys(a).reduce((c, e) => b.includes(e) ? {...c, [e]:a[e]} : c, {});
}, cb = async a => {
  try {
    return await G(a);
  } catch (b) {
    return null;
  }
}, ab = async(a, b) => {
  await G(b, a);
};
module.exports = bb;


//# sourceMappingURL=namecheapweb.js.map