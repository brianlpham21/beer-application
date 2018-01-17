'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

describe('Beer API Resource', function() {

  before(function() {
    runServer();
  });

  after(function() {
    closeServer();
  });

  describe('GET Endpoint', function() {
    it('should return HTML and a 200 status code', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
        })
    });
  });
  
});
