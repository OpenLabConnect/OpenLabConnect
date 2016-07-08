'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('Analyzer API', function () {

  var user = {},
    wrongBase = {},
    base = {},
    analyzerId,
    analyzerIds = [];
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
          .get('/api/analyzers/')
          .set({
            'Authorization': 'Bearer ' + res.body.token,
            'Content-Type': 'application/json'
          })
          .end(function (err, res) {
            if (err) { return done(err); }
            res.body.forEach(function (analyzerResults) {
              analyzerIds.push(analyzerResults._id);
            });
            analyzerId = res.body[0]._id;
            done();
          });
      });
  });

  describe('\n\t GET api/analyzers/', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/analyzers/')
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have incorrect token', function (done) {
      request(server)
        .get('/api/analyzers/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with array of analyzers when have a correct token', function (done) {
      request(server)
        .get('/api/analyzers/')
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.should.have.property('body');
          res.body.should.be.an.Array;
          done();
        });
    });
  });

  describe('\n\t GET api/analyzers/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/analyzers/' + analyzerId)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have incorrect token', function (done) {
      request(server)
        .get('/api/analyzers/' + analyzerId)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a analyzer have a correct token and analyzerId', function (done) {
      request(server)
        .get('/api/analyzers/' + analyzerId)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(analyzerId);
          done();
        });
    });

    it('should respond with a message error when have a correct token but incorrect analyzerId', function (done) {
      request(server)
        .get('/api/analyzers/' + 'wrong analyzerId')
        .set(base)
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.message.should.containEql('Cast to ObjectId failed for value "wrong analyzerId" at path "_id"');
          done();
        });
    });
  });

  describe('\n\t PUT api/analyzers/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/analyzers/' + analyzerId)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have incorrect token', function (done) {
      request(server)
        .put('/api/analyzers/' + analyzerId)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with error_code = 0 when have a correct token,analyzerId', function (done) {
      request(server)
        .put('/api/analyzers/' + analyzerId)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.error_code.should.be.exactly(0);
          done();
        });
    });

    it('should respond with a message error when have a correct token but incorrect analyzerId', function (done) {
      request(server)
        .put('/api/analyzers/' + 'wrong analyzerId')
        .set(base)
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.message.should.containEql('Cast to ObjectId failed for value "wrong analyzerId" at path "_id"');
          done();
        });
    });
  });

  describe('\n\t PUT api/analyzers/', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/analyzers/')
        .send({'ids': analyzerIds})
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have incorrect token', function (done) {
      request(server)
        .put('/api/analyzers/')
        .set(wrongBase)
        .send({'ids': analyzerIds})
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with error_code = 0 when have a correct token,analyzerIds', function (done) {
      request(server)
        .put('/api/analyzers/')
        .set(base)
        .send({'ids': analyzerIds})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.error_code.should.be.exactly(0);
          done();
        });
    });

    it('should respond with Bad request error when have a correct token but without analyzerIds', function (done) {
      request(server)
        .put('/api/analyzers/')
        .set(base)
        .expect(500)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.error.text.should.be.containEql('Bad request.!');
          done();
        });
    });

    it('should respond with a message error when have a correct token and empty analyzerIds', function (done) {
      request(server)
        .put('/api/analyzers/')
        .set(base)
        .send({'ids': []})
        .expect(500)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.error.text.should.be.containEql('Bad request.!');
          done();
        });
    });

    it('should respond with a message error when have a correct token and incorrect analyzerIds', function (done) {
      request(server)
        .put('/api/analyzers/')
        .set(base)
        .send({'ids': 'wrong analyzerIds'})
        .expect(500)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('Bad request.');
          done();
        });
    });
  });

  describe('\n\t POST api/analyzers/', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/analyzers/')
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with a unauthorized error when have incorrect token', function (done) {
      request(server)
        .post('/api/analyzers/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with bad request error when have a correct token,incorrect analyzerId', function (done) {
      request(server)
        .post('/api/analyzers/')
        .set(base)
        .send('wronganalyzer')
        .expect(400)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });

});


