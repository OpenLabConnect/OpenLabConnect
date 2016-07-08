'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('Table API', function() {

  var user = {},
    wrongBase = {},
    base = {},
    table = {},
    tables = [];
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
          .get('/api/tables/')
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
            res.body.some(function (table) {
              tables.push(table._id);
              return tables.length == 4;
            });
            table = res.body[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/tables', function() {
    it('should respond with a unauthorized error when do not have a token', function(done) {
      request(server)
        .get('/api/tables/')
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
        .get('/api/tables/')
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

    it('should respond with array of table when have a correct token', function (done) {
      request(server)
        .get('/api/tables/')
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
  describe('\n\t GET /api/tables/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/tables/' + table._id)
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
        .get('/api/tables/' + table._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with table when have a correct token', function (done) {
      request(server)
        .get('/api/tables/' + table._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(table._id);
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .get('/api/tables/' + 'wrong tablesId')
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
  describe('\n\t PUT /api/tables/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/tables/' + table._id)
        .send(table)
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
        .put('/api/tables/' + table._id)
        .set(wrongBase)
        .send(table)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with table when have a correct token', function (done) {
      request(server)
        .put('/api/tables/' + table._id)
        .set(base)
        .send(table)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(table._id);
          done();
        });
    });

    it('should respond with bad request error when have a incorrect id', function (done) {
      request(server)
        .put('/api/tables/' + 'wrong tableId')
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
  describe('\n\t POST /api/tables', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/tables/')
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
        .post('/api/tables/')
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