# WSSE

WSSE Username Token generator for Node.js

See: http://www.xml.com/pub/a/2003/12/17/dive.html

## Installation

    $ npm install wsse

## Usage

    var wsse = require('wsse');

    var options = { username: 'bob', password: 'taadtaadpstcsm' };

    // you can other syntax:
    // var token = new wsse.UsernameToken(options);
    var token = wsse(options);

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

    // ----- advanced -----

    // e.g. 'UsernameToken Username="bob", PasswordDigest="quR/EWLAV4xLf9Zqyw4pDmfV9OY=", Nonce="ZDM2ZTMxNjI4Mjk1OWE5ZWQ0Yzg5ODUxNDk3YTcxN2Y=", Created="2003-12-15T14:43:07Z"'
    console.log(token.getWSSEHeader({ nonceBase64: true }));

## Badges

[![Build Status](https://travis-ci.org/bouzuya/node-wsse.svg)](https://travis-ci.org/bouzuya/node-wsse)

## License

### >=2.0.0

[MIT](LICENSE)

### <1.0.0

ISC

## Author

[bouzuya][user] &lt;[m@bouzuya.net][email]&gt; ([http://bouzuya.net][url])

[user]: https://github.com/bouzuya
[email]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
