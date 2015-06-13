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

    # specify created & nonce
    @token1 = new UsernameToken { @created, @nonce, @username, @password }

    # auto generate created & nonce
    @token2 = new UsernameToken { @username, @password }

  describe '#getCreated', ->
    it 'works', ->
      assert @token1.getCreated() is @created
      assert @token2.getCreated() isnt null

  describe '#getNonce', ->
    it 'works', ->
      assert @token1.getNonce() is @nonce
      assert @token2.getNonce() isnt null

  describe '#getPassword', ->
    it 'works', ->
      assert @token1.getPassword() is @password

  describe '#getPasswordDigest', ->
    it 'works', ->
      assert @token1.getPasswordDigest() is @digest

  describe '#getUsername', ->
    it 'works', ->
      assert @token1.getUsername() is @username

  describe '#getWSSEHeader', ->
    context 'with no args', ->
      it 'works', ->
        assert @token1.getWSSEHeader() is @header

    context 'with with { nonceBase64: true }', ->
      it 'works', ->
        assert @token1.getWSSEHeader(nonceBase64: true) is @nonceBase64Header

  describe '#toString', ->
    it 'works', ->
      assert @token1.toString() is @header
      assert @token1 + '' is @header
