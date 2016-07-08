'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('Analyzer-Result API', function () {

  var user = {},
    wrongBase = {},
    base = {},
    analyzerResult,
    analyzerResultIds = [];
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
          .get('/api/test-results/')
          .set({
            'Authorization': 'Bearer ' + res.body.token,
            'Content-Type': 'application/json'
          })
          .end(function (err, res) {
            if (err) { return done(err); }
            res.body.analyzerResult.some(function (analyzerResults) {
              analyzerResultIds.push(analyzerResults._id);
              return analyzerResultIds.length == 4;
            });
            analyzerResult = res.body.analyzerResult[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/test-results', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/test-results/')
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
        .get('/api/test-results/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with analyzerResult and totalAnalyzerResult when have a correct token', function (done) {
      request(server)
        .get('/api/test-results/')
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.should.be.an.Array;
          res.body.should.have.properties('analyzerResult','totalAnalyzerResult');
          done();
        });
    });
  });

  describe('\n\t GET /api/test-results/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/test-results/' + analyzerResult._id)
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
        .get('/api/test-results/' + analyzerResult._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with analyzerResult and totalAnalyzerResult when have a correct token', function (done) {
      request(server)
        .get('/api/test-results/' + analyzerResult._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(analyzerResult._id);
          done();
        });
    });

  });

  describe('\n\t PUT /api/test-results/:id', function () {
    it('should respond with a Unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/test-results/' + analyzerResult._id)
        .send(analyzerResult)
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
        .put('/api/test-results/' + analyzerResult._id)
        .set(wrongBase)
        .send(analyzerResult)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });


    it('should respond with Bad request error when have a correct token, correct analyzerResult but incorrect result', function (done) {
      request(server)
        .put('/api/test-results/' + analyzerResult._id)
        .set(base)
        .send('wrong analyzerResult')
        .expect(400)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });

  describe('\n\t PUT /api/test-results/', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/test-results/')
        .send({'ids': analyzerResultIds})
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a Unauthorized error when have a incorrect token', function (done) {
      request(server)
        .put('/api/test-results/')
        .set(wrongBase)
        .send({'ids': analyzerResultIds})
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with {error_code: 0} when have a correct token', function (done) {
      request(server)
        .put('/api/test-results/')
        .set(base)
        .send({'ids': analyzerResultIds})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.error_code.should.be.exactly(0);
          done();
        });
    });

  });

  describe('\n\t POST /api/test-results/', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/test-results/')
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a Unauthorized error when have a incorrect token', function (done) {
      request(server)
        .post('/api/test-results/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with properties _id and receivedDate when have a correct token', function (done) {
      request(server)
        .post('/api/test-results/')
        .set(base)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.should.have.properties('_id', 'receivedDate');
          done();
        });
    });

    it('should respond with a Bad request error when have a in correct token but incorrect parram', function (done) {
      request(server)
        .post('/api/analyzers/')
        .set(base)
        .send('wrongParam')
        .expect(400)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });

  describe('\n\t DELETE /api/test-results/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .delete('/api/test-results/' + analyzerResult._id)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a Unauthorized error when have a incorrect token', function (done) {
      request(server)
        .delete('/api/test-results/' + analyzerResult._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with properties _id and receivedDate when have a correct token', function (done) {
      request(server)
        .delete('/api/test-results/' + analyzerResult._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.should.have.properties('_id', 'receivedDate');
          done();
        });
    });

    it('should respond with a Bad request error when have a in correct token but incorrect parram', function (done) {
      request(server)
        .delete('/api/analyzers/' + 'wrongAnalyzerId')
        .set(base)
        .send('wrongParam')
        .expect(400)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });

  describe('\n\t DELETE /api/test-results/', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .delete('/api/test-results/')
        .send({'ids': analyzerResultIds})
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a Unauthorized error when have a incorrect token', function (done) {
      request(server)
        .delete('/api/test-results/')
        .set(wrongBase)
        .send({'ids': analyzerResultIds})
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
