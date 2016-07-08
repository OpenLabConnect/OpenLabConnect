'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('Test-Type API', function() {

  var user = {},
    wrongBase = {},
    base = {},
    testType = {},
    testTypes = [];
  user.email = 'admin';
  user.password = 'admin';
  wrongBase.Authorization = 'Bearer ' + 'wrong token';
  wrongBase['Content-Type'] = 'application/json';
  base['Content-Type'] = 'application/json';

  before(function(done) {
    request(server)
      .post('/auth/local')
      .send(user)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        base.Authorization = 'Bearer ' + res.body.token;
        request(server)
          .get('/api/test-types')
          .set({
            'Authorization': 'Bearer ' + res.body.token,
            'Content-Type': 'application/json'
          })
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            res.body.some(function (testType) {
              testTypes.push(testType._id);
            });
            testType = res.body[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/test-types', function() {
    it('should respond with a unauthorized error when do not have a token', function(done) {
      request(server)
        .get('/api/test-types/')
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have a incorrect token', function(done) {
      request(server)
        .get('/api/test-types/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with array of testType when have a correct token', function (done) {
      request(server)
        .get('/api/test-types/')
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.should.be.an.Array;
          done();
        });
    });
  });
  describe('\n\t GET /api/test-types/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/test-types/' + testType._id)
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
        .get('/api/test-types/' + testType._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });
    it('should respond with array of testType when have a correct token', function (done) {
      request(server)
        .get('/api/test-types/' + testType._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(testType._id);
          done();
        });
    });
    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .get('/api/test-types/' + 'wrong testsId')
        .set(base)
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });
  describe('\n\t PUT /api/test-types/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/test-types/' + testType._id)
        .send(testType)
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
        .put('/api/test-types/' + testType._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .put('/api/test-types/' + 'wrong testId')
        .set(base)
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });
  describe('\n\t POST /api/tests', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/test-types/')
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
        .post('/api/test-types/')
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