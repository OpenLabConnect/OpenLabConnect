'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('Test-Result API', function () {

  var user = {},
    wrongBase = {},
    base = {},
    testResult = {},
    testResults = [];
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
        request(server)
          .get('/api/results/')
          .set({
            'Authorization': 'Bearer ' + res.body.token,
            'Content-Type': 'application/json'
          })
          .end(function (err, res) {
            if (err) { return done(err); }
            res.body.some(function (testResult) {
              testResults.push(testResult._id);
              return testResults.length == 4;
            });
            testResult = res.body[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/results', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/results/')
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
        .get('/api/results/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with array of testResult when have a correct token', function (done) {
      request(server)
        .get('/api/results/')
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
  describe('\n\t GET /api/results/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/results/' + testResult._id)
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
        .get('/api/results/' + testResult._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with array of testResult when have a correct token', function (done) {
      request(server)
        .get('/api/results/' + testResult._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(testResult._id);
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .get('/api/results/' + 'wrong testResultId')
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
  describe('\n\t PUT /api/results/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/results/' + testResult._id)
        .send(testResult)
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
        .put('/api/results/' + testResult._id)
        .set(wrongBase)
        .send(testResult)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with array of testResult when have a correct token', function (done) {
      request(server)
        .put('/api/results/' + testResult._id)
        .set(base)
        .send(testResult)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(testResult._id);
          done();
        });
    });

    it('should respond with bad request error when have a correct token but incorrect id', function (done) {
      request(server)
        .put('/api/results/' + 'wrongTestResult._id')
        .set(base)
        .send(testResult)
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });
  describe('\n\t POST /api/results', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/results/')
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
        .post('/api/results/')
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
