crypto = require 'crypto'

class UsernameToken
  constructor: ({ username, password, created, nonce } = {}) ->
    @_username = username
    @_password = password
    @_created = created ? @_newCreated()
    @_nonce = nonce ? @_newNonce()

  getCreated: ->
    @_created

  getNonce: ->
    @_nonce

  getNonceBase64: ->
    @_base64 @_nonce

  getPassword: ->
    @_password

  getPasswordDigest: ->
    @_digest @getNonce() + @getCreated() + @getPassword()

  getUsername: ->
    @_username

  getWSSEHeader: ({ nonceBase64 } = {}) ->
    nonceBase64 = nonceBase64 ? false
    'UsernameToken ' +
    [
      "Username=\"#{@getUsername()}\""
      "PasswordDigest=\"#{@getPasswordDigest()}\""
      "Nonce=\"#{if nonceBase64 then @getNonceBase64() else @getNonce()}\""
      "Created=\"#{@getCreated()}\""
    ].join ', '

  toString: ({ nonceBase64 } = {}) ->
    @getWSSEHeader { nonceBase64 }

  _base64: (s) ->
    new Buffer(s).toString 'base64'

  _digest: (s) ->
    sha1 = crypto.createHash 'sha1'
    sha1.update s, 'utf-8'
    sha1.digest 'base64'

  _newCreated: ->
    new Date().toISOString()

  _newNonce: ->
    [0..9].map(-> Math.floor(Math.random() * 256).toString(16)).join('')

module.exports = ({ username, password } = {}) ->
  new UsernameToken({ username, password })

module.exports.UsernameToken = UsernameToken
