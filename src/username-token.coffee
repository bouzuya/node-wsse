crypto = require 'crypto'

class UsernameToken
  constructor: ({ username, password }) ->
    @_username = username
    @_password = password
    @_created = @_newCreated()
    @_nonce = @_newNonce()

  getCreated: ->
    @_created

  getNonce: ->
    @_nonce

  getPassword: ->
    @_password

  getPasswordDigest: ({ created, nonce } = {}) ->
    created = created ? @getCreated()
    nonce = nonce ? @getNonce()
    @_digest nonce + created + @getPassword()

  getUsername: ->
    @_username

  getWSSEHeader: ({ created, nonce, nonceBase64 } = {}) ->
    created = created ? @getCreated()
    nonce = nonce ? @getNonce()
    nonceBase64 = nonceBase64 ? false
    'UsernameToken ' +
    [
      "Username=\"#{@getUsername()}\""
      "PasswordDigest=\"#{@getPasswordDigest({ created, nonce })}\""
      "Nonce=\"#{if nonceBase64 then @_base64(nonce) else nonce}\""
      "Created=\"#{@getCreated()}\""
    ].join ', '

  toString: ({ created, nonce, nonceBase64 } = {}) ->
    @getWSSEHeader { created, nonce, nonceBase64 }

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
