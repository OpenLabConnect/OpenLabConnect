'use strict';

require('should');

var server = require('../../../server');
var request = require('supertest');

describe('Import-Analyzer API', function () {

  var user = {},
    wrongBase = {},
    base = {},
    histories = [],
    history = {};
  user.email = 'admin';
  user.password = 'admin';
  wrongBase.Authorization = 'Bearer ' + 'wrong token';
  wrongBase['Content-Type'] = 'application/json';
  base['Content-Type'] = 'application/json';

  before(function (done) {
    request(server)
      .post('/auth/local')
      .send(user)
      .end(function (err, res) {
        if (err) { return done(err); }
        base.Authorization = 'Bearer ' + res.body.token;
        done();
      });
  });

  describe('\n\t GET /api/import-analyzers/file', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/import-analyzers/file/')
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have a incorrect token', function (done) {
      request(server)
        .post('/api/import-analyzers/file/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });
  });

});
