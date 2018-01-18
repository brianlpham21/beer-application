'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');
const {Beer} = require('../models');

const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBeerData() {
  console.info('seeding beer data');
  const seedData = [];

  for (let i = 0; i < 5; i++) {
    seedData.push(generateNewBeerData());
  };

  return Beer.insertMany(seedData);
};

function generateNewBeerData() {
  return {
    beerName: faker.lorem.words(),
    beerType: faker.lorem.words(),
    breweryName: faker.lorem.words()
  };
};

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
};

describe('Beer API Resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBeerData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('Index Page', function() {
    it('should return HTML and a 200 status code', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
        });
    });
  });

  describe('GET Endpoint', function() {
    it('should return existing beers', function() {
      let res;

      return chai.request(app)
        .get('/beers')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res).to.be.a('object');
          expect(res.body.beers).to.have.length.of.at.least(1);
          return Beer.count();
        })
        .then(function(count) {
          expect(res.body.beers).to.have.length(count);
        });
    });

    it('should return beers with right fields', function() {
      let resBeer;
      return chai.request(app)
        .get('/beers')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.beers).to.be.a('array');
          expect(res.body.beers).to.have.length.of.at.least(1);

          res.body.beers.forEach(function(beer) {
            expect(beer).to.be.a('object');
            expect(beer).to.include.keys(
              'id', 'beerName', 'beerType', 'breweryName');
          });
          resBeer = res.body.beers[0];
          return Beer.findById(resBeer.id);
        })
        .then(function(beer) {
          expect(resBeer.id).to.equal(beer.id);
          expect(resBeer.beerName).to.equal(beer.beerName);
          expect(resBeer.beerType).to.equal(beer.beerType);
          expect(resBeer.breweryName).to.equal(beer.breweryName);
        });
    });
  });

  describe('PUT Endpoint', function() {
    it('should update fields for a beer', function() {
      const updateData = {
        beerName: "New Updated Beer Name",
        beerType: "New Updated Beer Type",
        breweryName: "New Updated Brewery Name"
      };

      return Beer
        .findOne()
        .then(function(beer) {
          updateData.id = beer.id;
          return chai.request(app)
            .put(`/beer/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Beer.findById(updateData.id)
        })
        .then(function(beer) {
          expect(beer.beerName).to.equal(updateData.beerName);
          expect(beer.beerType).to.equal(updateData.beerType);
          expect(beer.breweryName).to.equal(updateData.breweryName);
        });
    });
  });

  describe('DELETE Endpoint', function() {
    it('should delete a beer by id', function() {
      let beer;

      return Beer
        .findOne()
        .then(function(_beer) {
          beer = _beer;
          return chai.request(app).delete(`/beers/${beer.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Beer.findById(beer.id);
        })
        .then(function(_beer) {
          expect(_beer).to.be.null;
        });
    });
  });
});
