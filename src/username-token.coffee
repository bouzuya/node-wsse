crypto = require 'crypto'

class UsernameToken
  constructor: ({ username, password, created, nonce, sha1encoding } = {}) ->
    @_username = username # required
    @_password = password # required
    @_created = created ? @_newCreated()
    @_nonce = nonce ? @_newNonce()
    @_sha1encoding = sha1encoding ? undefined

  getCreated: ->
    @_created

  getNonce: ->
    @_nonce

  getNonceBase64: ->
    @_base64 @_nonce

  getPassword: ->
    @_password

  getPasswordDigest: ->
    text = @getNonce() + @getCreated() + @getPassword()
    @_base64 @_sha1(text, @_sha1encoding)

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

  _sha1: (s, encoding) ->
    sha1 = crypto.createHash 'sha1'
    sha1.update s, 'utf-8'
    sha1.digest encoding # return Buffer if encoding is undefined

  _newCreated: ->
    new Date().toISOString()

  _newNonce: ->
    [0..9].map(-> Math.floor(Math.random() * 256).toString(16)).join('')

module.exports = ({ username, password } = {}) ->
  new UsernameToken({ username, password })

module.exports.UsernameToken = UsernameToken
