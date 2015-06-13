assert = require 'power-assert'
wsse = require '../src/username-token'

describe 'UsernameToken', ->
  beforeEach ->
    { UsernameToken } = wsse
    @created = '2003-12-15T14:43:07Z'
    @digest = 'quR/EWLAV4xLf9Zqyw4pDmfV9OY='
    @nonce = 'd36e316282959a9ed4c89851497a717f'
    @nonceBase64 = 'ZDM2ZTMxNjI4Mjk1OWE5ZWQ0Yzg5ODUxNDk3YTcxN2Y='
    @password = 'taadtaadpstcsm'
    @username = 'bob'
    @header = 'UsernameToken ' + [
      "Username=\"#{@username}\""
      "PasswordDigest=\"#{@digest}\""
      "Nonce=\"#{@nonce}\""
      "Created=\"#{@created}\""
    ].join ', '
    @nonceBase64Header = 'UsernameToken ' + [
      "Username=\"#{@username}\""
      "PasswordDigest=\"#{@digest}\""
      "Nonce=\"#{@nonceBase64}\""
      "Created=\"#{@created}\""
    ].join ', '

    UsernameToken.prototype._newCreated = => @created
    UsernameToken.prototype._newNonce = => @nonce

    @token = new UsernameToken { @username, @password }

  describe '#getCreated', ->
    it 'works', ->
      assert @token.getCreated() is @created

  describe '#getNonce', ->
    it 'works', ->
      assert @token.getNonce() is @nonce

  describe '#getPassword', ->
    it 'works', ->
      assert @token.getPassword() is @password

  describe '#getPasswordDigest', ->
    it 'works', ->
      assert @token.getPasswordDigest() is @digest

  describe '#getUsername', ->
    it 'works', ->
      assert @token.getUsername() is @username

  describe '#getWSSEHeader', ->
    context 'when no args', ->
      it 'works', ->
        assert @token.getWSSEHeader() is @header

    context 'when with { nonceBase64: true }', ->
      it 'works', ->
        assert @token.getWSSEHeader(nonceBase64: true) is @nonceBase64Header

  describe '#toString', ->
    it 'works', ->
      assert @token.toString() is @header
      assert @token + '' is @header
