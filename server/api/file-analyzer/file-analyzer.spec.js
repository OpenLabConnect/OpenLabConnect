'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('File-Analyzer API', function () {

  var user = {},
    wrongBase = {},
    base = {},
    fileAnalyzers = [],
    fileAnalyzer = {};
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
          .get('/api/file-analyzers')
          .set({
            'Authorization': 'Bearer ' + res.body.token,
            'Content-Type': 'application/json'
          })
          .end(function (err, res) {
            if (err) { return done(err); }
            fileAnalyzers = res.body;
            fileAnalyzer = res.body[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/file-analyzers', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/file-analyzers/')
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
        .get('/api/file-analyzers/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with array of file-analyzers when have a correct token', function (done) {
      request(server)
        .get('/api/file-analyzers/')
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
  describe('\n\t GET /api/file-analyzers/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/file-analyzers/' + fileAnalyzer._id)
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
        .get('/api/file-analyzers/' + fileAnalyzer._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with file-analyzers when have a correct token', function (done) {
      request(server)
        .get('/api/file-analyzers/' + fileAnalyzer._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(fileAnalyzer._id);
          done();
        });
    });
  });
  describe('\n\t PUT /api/file-analyzers/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/file-analyzers/' + fileAnalyzer._id)
        .expect(401)
        .send(fileAnalyzer)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have a incorrect token', function (done) {
      request(server)
        .put('/api/file-analyzers/' + fileAnalyzer._id)
        .set(wrongBase)
        .send(fileAnalyzer)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with file-analyzers when have a correct token', function (done) {
      request(server)
        .put('/api/file-analyzers/' + fileAnalyzer._id)
        .set(base)
        .send(fileAnalyzer)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(fileAnalyzer._id);
          done();
        });
    });
  });

  describe('\n\t POST /api/file-analyzers/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/file-analyzers/')
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
        .post('/api/file-analyzers/')
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
