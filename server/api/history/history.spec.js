'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('History API', function () {

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
        request(server)
          .get('/api/histories')
          .set({
            'Authorization': 'Bearer ' + res.body.token,
            'Content-Type': 'application/json'
          })
          .query({
            page: 1,
            analyzerId: null,
            fromDate: null,
            toDate: null,
            limit: 10
          })
          .end(function (err, res) {
            if (err) { return done(err); }
            res.body.historyResult.some(function (history) {
              histories.push(history._id);
              return histories.length == 4;
            });
            history =  res.body.historyResult[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/histories', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/histories/')
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
        .get('/api/histories/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with properties historyResult and totalHistoryResult have a correct token', function (done) {
      request(server)
        .get('/api/histories/')
        .set(base)
        .query({
            page: 1,
            analyzerId: null,
            fromDate: null,
            toDate: null,
            limit: 10
          })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.should.have.properties('historyResult', 'totalHistoryResult');
          done();
        });
    });
  });
  describe('\n\t GET /api/histories/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/histories/' + history._id)
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
        .get('/api/histories/' + history._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with properties historyResult and totalHistoryResult have a correct token', function (done) {
      request(server)
        .get('/api/histories/' + history._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(history._id);
          done();
        });
    });

    it('should respond with bad request when have a correct token but incorrect id', function (done) {
      request(server)
        .get('/api/histories/' + 'wrongHistory._id')
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
  describe('\n\t PUT /api/histories/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/histories/' + history._id)
        .send(history)
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
        .put('/api/histories/' + history._id)
        .set(wrongBase)
        .send(history)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with history when have a correct token', function (done) {
      request(server)
        .put('/api/histories/' + history._id)
        .set(base)
        .send(history)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(history._id);
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .put('/api/histories/' + 'wrong testId')
        .set(base)
        .send(history)
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
        .post('/api/histories/')
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
        .post('/api/histories/')
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
