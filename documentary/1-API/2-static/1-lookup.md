## `async static LOOKUP_IP(): string`

Get the public IP address using [https://api.ipify.org](https://api.ipify.org).

%~%

## `async static WHOIS(domain): string`

Return WHOIS data for the domain.

%EXAMPLE: example/whois, ../src => @rqt/namecheap-web%

<details>
<summary>Show whois data</summary>

%FORK example/whois%
</details>

%~%

## `async static COUPON(): string`

Returns this month's coupon from the https://www.namecheap.com/promos/coupons/ page.

%EXAMPLE: example/coupon, ../src => @rqt/namecheap-web%
%FORK example/coupon%

%~%

## `async static SANDBOX_COUPON(): string`

Returns this month's coupon from the https://www.sandbox.namecheap.com/promos/coupons/ page.

%EXAMPLE: example/sandbox-coupon, ../src => @rqt/namecheap-web%
%FORK example/sandbox-coupon%

%~%