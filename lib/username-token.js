var UsernameToken, crypto;

crypto = require('crypto');

UsernameToken = (function() {
  function UsernameToken(arg) {
    var password, username;
    username = arg.username, password = arg.password;
    this._username = username;
    this._password = password;
    this._created = this._newCreated();
    this._nonce = this._newNonce();
  }

  UsernameToken.prototype.getCreated = function() {
    return this._created;
  };

  UsernameToken.prototype.getNonce = function() {
    return this._nonce;
  };

  UsernameToken.prototype.getPassword = function() {
    return this._password;
  };

  UsernameToken.prototype.getPasswordDigest = function(arg) {
    var created, nonce, ref;
    ref = arg != null ? arg : {}, created = ref.created, nonce = ref.nonce;
    created = created != null ? created : this.getCreated();
    nonce = nonce != null ? nonce : this.getNonce();
    return this._digest(nonce + created + this.getPassword());
  };

  UsernameToken.prototype.getUsername = function() {
    return this._username;
  };

  UsernameToken.prototype.getWSSEHeader = function(arg) {
    var created, nonce, nonceBase64, ref;
    ref = arg != null ? arg : {}, created = ref.created, nonce = ref.nonce, nonceBase64 = ref.nonceBase64;
    created = created != null ? created : this.getCreated();
    nonce = nonce != null ? nonce : this.getNonce();
    nonceBase64 = nonceBase64 != null ? nonceBase64 : false;
    return 'UsernameToken ' + [
      "Username=\"" + (this.getUsername()) + "\"", "PasswordDigest=\"" + (this.getPasswordDigest({
        created: created,
        nonce: nonce
      })) + "\"", "Nonce=\"" + (nonceBase64 ? this._base64(nonce) : nonce) + "\"", "Created=\"" + (this.getCreated()) + "\""
    ].join(', ');
  };

  UsernameToken.prototype.toString = function(arg) {
    var created, nonce, nonceBase64, ref;
    ref = arg != null ? arg : {}, created = ref.created, nonce = ref.nonce, nonceBase64 = ref.nonceBase64;
    return this.getWSSEHeader({
      created: created,
      nonce: nonce,
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
