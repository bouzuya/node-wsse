var crypto = require('crypto');

// http://www.xml.com/pub/a/2003/12/17/dive.html

var Wsse = function() {};

Wsse.prototype.getNonce = function() {
  var created = new Date().toISOString();
  var nonce = '';
  for(var i = 0; i < 10; i++) {
    var r = Math.floor(Math.random() * 256);
    nonce += r.toString(16);
  }
  return { created: created, nonce: nonce };
};

Wsse.prototype.getPasswordDigest = function(nonce, created, password) {
  var input = nonce + created + password;
  var sha1 = crypto.createHash('sha1');
  sha1.update(input, 'utf-8');
  return sha1.digest('base64');
};

Wsse.prototype.base64 = function(s) {
  return new Buffer(s).toString('base64');
};

Wsse.prototype.getUsernameToken = function(username, password, options) {
  options = options || {};
  var nonceBase64 = !!options.nonceBase64 || false;
  var nonceObj = this.getNonce();
  var nonce = nonceObj.nonce;
  var created = nonceObj.created;
  var passwordDigest = this.getPasswordDigest(nonce, created, password);
  var headerNonce = nonceBase64 ? this.base64(nonce) : nonce;
  var usernameToken = '';
  usernameToken += 'Username="' + username + '", ';
  usernameToken += 'PasswordDigest="' + passwordDigest + '", ';
  usernameToken += 'Nonce="' + headerNonce + '", ';
  usernameToken += 'Created="' + created + '"';
  return usernameToken;
};

module.exports = function() { return new Wsse(); };

