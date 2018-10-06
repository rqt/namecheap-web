### `async static LOOKUP_IP(): string`

Get the public IP address using [https://api.ipify.org](https://api.ipify.org).

%~ width="15"%

### `async static WHOIS(domain): string`

Return WHOIS data for the domain.

%EXAMPLE: example/whois.js, ../src => @rqt/namecheap-web%

<details>
<summary>Show whois data</summary>

%FORK example example/whois%
</details>

%~ width="15"%

### `async static COUPON(): string`

Returns this month's coupon from the https://www.namecheap.com/promos/coupons/ page.

%EXAMPLE: example/coupon.js, ../src => @rqt/namecheap-web%
%FORK example example/coupon%

%~ width="15"%