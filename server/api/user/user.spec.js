'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('User API', function () {
  var token,user = {};
  user.email = 'admin';
  user.password = 'admin';
  before(function (done) {
    request(server)
      .post('/auth/local')
      .send(user)
      .end(function (err, res) {
        if (err) { return done(err); }
        token = res.body.token;
        done();
      });
  });
  describe('\n\t GET /api/users/me', function () {
    it('should respond with a unauthorized error when have not a token', function (done) {
      request(server)
        .get('/api/users/me')
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have a incorrect token', function (done) {
      var base = {};
      base.Authorization = 'Bearer ' + 'wrong token';
      base['Content-Type'] = 'application/json';
      request(server)
        .get('/api/users/me')
        .set(base)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });
  });

  // describe('\n\t POST /api/users/', function () {
  //   it('should respond with a user and token', function (done) {
  //     request(server)
  //       .post('/api/users/')
  //       .expect(201)
  //       .expect('Content-Type', /json/)
  //       .end(function (err, res) {
  //         if (err) { return done(err); }
  //         res.body.should.have.properties('user', 'token');
  //         done();
  //       });
  //   });
  // });

});