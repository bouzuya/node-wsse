var expect = require('chai').expect;
var wsse = require('../lib/wsse')();

// http://www.xml.com/pub/a/2003/12/17/dive.html

describe('Wsse', function() {

  describe('getNonce', function() {

    it('works', function(done) {
      var nonce = wsse.getNonce();
      expect(nonce).to.have.property('created');
      expect(nonce).to.have.property('nonce');
      done();
    });

  });

  describe('getPasswordDigest', function() {

    it('works', function(done) {
      var expected = 'quR/EWLAV4xLf9Zqyw4pDmfV9OY=';
      var password = 'taadtaadpstcsm';
      var nonce = 'd36e316282959a9ed4c89851497a717f';
      var created = '2003-12-15T14:43:07Z';
      var actual = wsse.getPasswordDigest(nonce, created, password);
      expect(actual).to.equal(expected);
      done();
    });

  });

  describe('getUsernameToken', function() {

    it('works', function() {
      var original = wsse.getNonce;
      wsse.getNonce = function() {
        return { created: '2003-12-15T14:43:07Z', nonce: 'd36e316282959a9ed4c89851497a717f' };
      };

      var expected = 'Username="bob", PasswordDigest="quR/EWLAV4xLf9Zqyw4pDmfV9OY=", Nonce="d36e316282959a9ed4c89851497a717f", Created="2003-12-15T14:43:07Z"';
      var username = 'bob';
      var password = 'taadtaadpstcsm';
      var actual = wsse.getUsernameToken(username, password);
      expect(actual).to.equal(expected);

      wsse.getNonce = original;
    });

  });

});
