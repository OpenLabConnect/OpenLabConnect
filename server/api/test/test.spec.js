'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('Test API', function() {

  var user = {},
    wrongBase = {},
    base = {},
    test = {},
    tests = [];
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
          .get('/api/tests/')
          .set({
            'Authorization': 'Bearer ' + res.body.token,
            'Content-Type': 'application/json'
          })
          .query({
            latest: false,
            page: 1,
            limit: 50
          })
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            res.body.testResult.some(function (test) {
              tests.push(test._id);
              return tests.length == 4;
            });
            test = res.body.testResult[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/tests', function() {
    it('should respond with a unauthorized error when do not have a token', function(done) {
      request(server)
        .get('/api/tests/')
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
        .get('/api/tests/')
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

    it('should respond with array of test when have a correct token', function (done) {
      request(server)
        .get('/api/tests/')
        .set(base)
        .query({
          latest: false,
          page: 1,
          limit: 50})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.should.be.an.Array;
          done();
        });
    });
  });
  describe('\n\t GET /api/tests/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/tests/' + test._id)
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
        .get('/api/tests/' + test._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with array of test when have a correct token', function (done) {
      request(server)
        .get('/api/tests/' + test._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(test._id);
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .get('/api/tests/' + 'wrong testsId')
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
  describe('\n\t PUT /api/tests/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/tests/' + test._id)
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
        .put('/api/tests/' + test._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with array of test when have a correct token', function (done) {
      request(server)
        .put('/api/tests/' + test._id)
        .set(base)
        .send(test)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(test._id);
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .put('/api/tests/' + 'wrong testId')
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
        .post('/api/tests/')
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
        .post('/api/tests/')
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