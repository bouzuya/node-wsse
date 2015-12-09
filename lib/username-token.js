var UsernameToken, crypto;

crypto = require('crypto');

UsernameToken = (function() {
  function UsernameToken(arg) {
    var created, nonce, password, ref, username;
    ref = arg != null ? arg : {}, username = ref.username, password = ref.password, created = ref.created, nonce = ref.nonce;
    this._username = username;
    this._password = password;
    this._created = created != null ? created : this._newCreated();
    this._nonce = nonce != null ? nonce : this._newNonce();
  }

  UsernameToken.prototype.getCreated = function() {
    return this._created;
  };

  UsernameToken.prototype.getNonce = function() {
    return this._nonce;
  };

  UsernameToken.prototype.getNonceBase64 = function() {
    return this._base64(this._nonce);
  };

  UsernameToken.prototype.getPassword = function() {
    return this._password;
  };

  UsernameToken.prototype.getPasswordDigest = function() {
    return this._digest(this.getNonce() + this.getCreated() + this.getPassword());
  };

  UsernameToken.prototype.getUsername = function() {
    return this._username;
  };

  UsernameToken.prototype.getWSSEHeader = function(arg) {
    var nonceBase64;
    nonceBase64 = (arg != null ? arg : {}).nonceBase64;
    nonceBase64 = nonceBase64 != null ? nonceBase64 : false;
    return 'UsernameToken ' + ["Username=\"" + (this.getUsername()) + "\"", "PasswordDigest=\"" + (this.getPasswordDigest()) + "\"", "Nonce=\"" + (nonceBase64 ? this.getNonceBase64() : this.getNonce()) + "\"", "Created=\"" + (this.getCreated()) + "\""].join(', ');
  };

  UsernameToken.prototype.toString = function(arg) {
    var nonceBase64;
    nonceBase64 = (arg != null ? arg : {}).nonceBase64;
    return this.getWSSEHeader({
      nonceBase64: nonceBase64
    });
  };

  UsernameToken.prototype._base64 = function(s) {
    return new Buffer(s).toString('base64');
  };

  UsernameToken.prototype._digest = function(s) {
    var sha1;
    sha1 = crypto.createHash('sha1');
    sha1.update(s, 'utf-8');
    return sha1.digest('base64');
  };

  UsernameToken.prototype._newCreated = function() {
    return new Date().toISOString();
  };

  UsernameToken.prototype._newNonce = function() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function() {
      return Math.floor(Math.random() * 256).toString(16);
    }).join('');
  };

  return UsernameToken;

})();

module.exports = function(arg) {
  var password, ref, username;
  ref = arg != null ? arg : {}, username = ref.username, password = ref.password;
  return new UsernameToken({
    username: username,
    password: password
  });
};

module.exports.UsernameToken = UsernameToken;
