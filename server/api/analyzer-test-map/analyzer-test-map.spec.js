'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('Analyzer-Test-Map API', function () {

  var user = {},
    wrongBase = {},
    base = {},
    analyzerTestMapResultPost = {
      analyzer: {
        '_id': '571ee0ccce5202541989f739',
        'comPort': 'COM 1',
        'baudRate': 'baudRate 001',
        'stopBit': 1,
        'parity': 500,
        'dataBit': 8,
        'flowControl': 'flowControl',
        'name': 'name 003',
        'description': '003',
        'protocol': 'serial',
        'actived': true,
        'enabled': true,
        '__v': 0,
        '__t': 'serial-analyzer'
      },
      testCode: 'IgG-ELISA DENGUE',
      __v: 0,
      test: {
        _id: '5732d1930adb33281e40774c',
        name: 'ELISA IgG Dengue',
        description: 'Phát hi?n kháng th? IgG kháng vi rút s?t xu?t huy?t (DENGUE)',
        normalRange: '',
        unit: '',
        section: 'Arbovirus',
        testId: '342',
        __v: 0
      }
    },
    incorrectAnalyzerTestMapResultPost = {
      testCode: 'IgG-ELISA DENGUE',
      __v: 0,
      test: {
        _id: '5732d1930adb33281e40774c',
        name: 'ELISA IgG Dengue',
        description: 'Phát hi?n kháng th? IgG kháng vi rút s?t xu?t huy?t (DENGUE)',
        normalRange: '',
        unit: '',
        section: 'Arbovirus',
        testId: '342',
        __v: 0
      }
    },
    analyzerTestMapResult = {},
    analyzerTestMapResultIds = [];
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
          .get('/api/test-maps/')
          .set({
            'Authorization': 'Bearer ' + res.body.token,
            'Content-Type': 'application/json'
          })
          .end(function (err, res) {
            if (err) { return done(err); }
            res.body.analyzerTestMapResult.some(function (analyzerTestMapResult) {
              analyzerTestMapResultIds.push(analyzerTestMapResult._id);
              return analyzerTestMapResultIds.length == 4;
            });
            analyzerTestMapResult = res.body.analyzerTestMapResult[0];
            done();
          });
      });
  });

  describe('\n\t GET /api/test-maps', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/test-maps/')
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
        .get('/api/test-maps/')
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with analyzerTestMapResult and totalAnalyzerTestMapResult when have a correct token', function (done) {
      request(server)
        .get('/api/test-maps/')
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body.should.be.an.Array;
          res.body.should.have.properties('analyzerTestMapResult','totalAnalyzerTestMapResult');
          done();
        });
    });
  });

  describe('\n\t GET /api/test-maps/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .get('/api/test-maps/' + analyzerTestMapResult._id)
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
        .get('/api/test-maps/' + analyzerTestMapResult._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with analyzerTestMapResult when have a correct token, Id', function (done) {
      request(server)
        .get('/api/test-maps/' + analyzerTestMapResult._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(analyzerTestMapResult._id);
          done();
        });
    });

    it('should respond with Cast to ObjectId failed error when have a correct token but incorrect id', function (done) {
      request(server)
        .get('/api/test-maps/' + 'wrong analyzerTestMapResultId')
        .set(base)
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('Cast to ObjectId failed');
          done();
        });
    });
  });

  describe('\n\t PUT /api/test-maps/:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .put('/api/test-maps/' + analyzerTestMapResult._id)
        .send(analyzerTestMapResult)
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
        .put('/api/test-maps/' + analyzerTestMapResult._id)
        .set(wrongBase)
        .send(analyzerTestMapResult)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with analyzerTestMapResult when have a correct token, Id', function (done) {
      request(server)
        .put('/api/test-maps/' + analyzerTestMapResult._id)
        .set(base)
        .send(analyzerTestMapResult)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(analyzerTestMapResult._id);
          done();
        });
    });

    it('should respond with Cast to ObjectId failed error when have a correct token but incorrect id', function (done) {
      request(server)
        .put('/api/test-maps/' + 'wrong analyzerTestMapResultId')
        .set(base)
        .send(analyzerTestMapResult)
        .expect(500)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('Cast to ObjectId failed');
          done();
        });
    });

    it('should respond with Bad request error when have a correct token, correct id, but incorrect testmap', function (done) {
      request(server)
        .put('/api/test-maps/' + analyzerTestMapResult._id)
        .set(base)
        .send('wrong testmap')
        .expect(400)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });

  describe('\n\t POST /api/test-maps/', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .post('/api/test-maps/')
        .send(analyzerTestMapResultPost)
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
        .post('/api/test-maps/')
        .set(wrongBase)
        .send(analyzerTestMapResultPost)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with analyzerTestMapResult have id when have a correct token, testmap', function (done) {
      request(server)
        .post('/api/test-maps/')
        .set(base)
        .send(analyzerTestMapResultPost)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.ok;
          done();
        });
    });

    it('should respond with Bad request error when have a correct token but incorrect testMap', function (done) {
      request(server)
        .post('/api/test-maps/')
        .set(base)
        .send('wrongAnalyzerTestMapResult')
        .expect(400)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });

    it('should respond with Bad request error when have a correct token, correct id, but empty testmap', function (done) {
      request(server)
        .post('/api/test-maps/')
        .set(base)
        .expect(500)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });

    it('should respond with Bad request error when have a correct token, correct id, but incorrect testmap', function (done) {
      request(server)
        .post('/api/test-maps/')
        .set(base)
        .send(incorrectAnalyzerTestMapResultPost)
        .expect(500)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.badRequest.should.be.true;
          done();
        });
    });
  });

  describe('\n\t DELETE /api/test-maps:id', function () {
    it('should respond with a unauthorized error when do not have a token', function (done) {
      request(server)
        .delete('/api/test-maps/' + analyzerTestMapResult._id)
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
        .delete('/api/test-maps/' + analyzerTestMapResult._id)
        .set(wrongBase)
        .expect(401)
        .expect('Content-Type', /html/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.text.should.containEql('UnauthorizedError');
          done();
        });
    });

    it('should respond with analyzerTestMapResult and totalAnalyzerTestMapResult when have a correct token', function (done) {
      request(server)
        .delete('/api/test-maps/' + analyzerTestMapResult._id)
        .set(base)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) { return done(err); }
          res.body._id.should.be.exactly(analyzerTestMapResult._id);
          done();
        });
    });

    it('should respond with when have a correct token but incorrect Id', function (done) {
      request(server)
        .delete('/api/test-maps/' + 'analyzerTestMapResult_wrongId')
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


});
