# WSSE

WSSE Username Token generator for Node.js

See: <http://www.xml.com/pub/a/2003/12/17/dive.html>

## Installation

```bash
npm install wsse
```

## Usage

```javascript
import wsse, { UsernameToken } from 'wsse';

const token = wsse({ username: 'bob', password: 'taadtaadpstcsm' });

// 'bob'
console.log(token.getUsername());

// 'taadtaadpstcsm'
console.log(token.getPassword());

// e.g. '2003-12-15T14:43:07Z'
console.log(token.getCreated());

// e.g. 'd36e316282959a9ed4c89851497a717f'
console.log(token.getNonce());

// e.g. 'quR/EWLAV4xLf9Zqyw4pDmfV9OY='
console.log(token.getPasswordDigest());

// e.g. 'UsernameToken Username="bob", PasswordDigest="quR/EWLAV4xLf9Zqyw4pDmfV9OY=", Nonce="d36e316282959a9ed4c89851497a717f", Created="2003-12-15T14:43:07Z"'
console.log(token.getWSSEHeader());
console.log(token.toString());
console.log(token + '');

// ----- advanced -----

// you can use `UsernameToken` class.
const token2 = new UsernameToken({
  username: 'bob',                           // (required)
  password: 'taadtaadpstcsm',                // (required)
  created: '2003-12-15T14:43:07Z',           // (optional) you can specify `craeted`.
  nonce: 'd36e316282959a9ed4c89851497a717f', // (optional) you can specify `nonce`.
  sha1encoding: 'hex'                        // (optional) you can specify `sha1encoding` for wrong WSSE Username Token implementation.
});

// you can use `nonceBase64` option. it encodes the nonce to base64 in header.
// 'UsernameToken Username="bob", PasswordDigest="quR/EWLAV4xLf9Zqyw4pDmfV9OY=", Nonce="ZDM2ZTMxNjI4Mjk1OWE5ZWQ0Yzg5ODUxNDk3YTcxN2Y=", Created="2003-12-15T14:43:07Z"'
// e.g. Hatena API http://developer.hatena.ne.jp/ja/documents/auth/apis/wsse
console.log(token2.getWSSEHeader({ nonceBase64: true }));
console.log(token2.toString({ nonceBase64: true }));
```

## Badges

[![npm version][npm-badge-url]][npm-url]
[![Coveralls][coveralls-badge-url]][coveralls-url]

[coveralls-badge-url]: https://img.shields.io/coveralls/github/bouzuya/node-wsse.svg
[coveralls-url]: https://coveralls.io/github/bouzuya/node-wsse
[npm-badge-url]: https://img.shields.io/npm/v/wsse.svg
[npm-url]: https://www.npmjs.com/package/wsse

## License

### >=2.0.0

[MIT](LICENSE)

### <1.0.0

ISC

## Author

[bouzuya][user] &lt;[m@bouzuya.net][email]&gt; ([https://bouzuya.net][url])

[user]: https://github.com/bouzuya
[email]: mailto:m@bouzuya.net
[url]: https://bouzuya.net
