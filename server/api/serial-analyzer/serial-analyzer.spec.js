'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('Serial-Analyzer API', function() {

  var user = {},
    wrongBase = {},
    base = {},
    analyzer = {},
    analyzers = [];
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
          .get('/api/serial-analyzers')
          .set(base)
          .end(function (err, res) {
            if (err) { return done(err); }
            analyzers = res.body;
            analyzer = res.body[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/serial-analyzers', function() {
    it('should respond with a unauthorized error when do not have a token', function(done) {
      request(server)
        .get('/api/serial-analyzers')
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
        .get('/api/serial-analyzers')
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

    it('should respond with array of network-analyzers when have a correct token', function (done) {
      request(server)
        .get('/api/serial-analyzers')
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
  describe('\n\t GET /api/serial-analyzers/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/serial-analyzers/' + analyzer._id)
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
        .get('/api/serial-analyzers/' + analyzer._id)
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
        .get('/api/serial-analyzers/' + analyzer._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(analyzer._id);
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .get('/api/serial-analyzers/' + 'wrong analyzerId')
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
  describe('\n\t PUT /api/serial-analyzers/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/serial-analyzers/' + analyzer._id)
        .send(analyzer)
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
        .put('/api/serial-analyzers/' + analyzer._id)
        .set(wrongBase)
        .send(analyzer)
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
        .put('/api/serial-analyzers/' + analyzer._id)
        .set(base)
        .send(analyzer)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(analyzer._id);
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .put('/api/serial-analyzers/' + 'wrong testId')
        .set(base)
        .send(analyzer)
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });
  describe('\n\t POST /api/network-analyzers', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/serial-analyzers/')
        .send(analyzer)
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
        .post('/api/network-analyzers/')
        .set(wrongBase)
        .send(analyzer)
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