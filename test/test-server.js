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
    beerName: faker.random.word(),
    beerType: faker.system.mimeType(),
    breweryName: faker.company.companyName(),
    breweryLocation: {
      city: faker.address.city(),
      state: faker.address.state()
    }
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

  describe('Add Form Page', function() {
    it('should return HTML and a 200 status code', function() {
      return chai.request(app)
        .get('/add.html')
        .then(function(res) {
          expect(res).to.have.status(200);
        });
    });
  });

  describe('GET Endpoint', function() {
    it('should return all beers', function() {
      let resBeer;
      return chai.request(app)
        .get('/beers')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.beers).to.be.a('array');
          expect(res.body.beers).to.have.length(5);

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

    it('should return a beer based on name', function() {
      let resBeer;

      return Beer
        .findOne()
        .then(function(beer) {
          return chai.request(app)
            .get(`/beers?beerName=${beer.beerName}`)
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          resBeer = res.body.beers[0];
          return Beer.findOne({beerName: res.body.beers[0].beerName})
        })
        .then(function(beer) {
          expect(beer.beerName).to.equal(resBeer.beerName);
          expect(beer.beerType).to.equal(resBeer.beerType);
          expect(beer.breweryName).to.equal(resBeer.breweryName);
          expect(resBeer.breweryLocation).to.contain(beer.breweryLocation.city);
          expect(resBeer.breweryLocation).to.contain(beer.breweryLocation.state);
        });
    });
  });

  describe('POST Endpoint', function() {
    it('should add a new beer', function() {
      const newBeer = generateNewBeerData();

      return chai.request(app)
        .post('/beers')
        .send(newBeer)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'beerName', 'beerType', 'breweryName', 'breweryLocation');
          expect(res.body.id).to.not.be.null;
          expect(res.body.beerName).to.equal(newBeer.beerName);
          expect(res.body.beerType).to.equal(newBeer.beerType);
          expect(res.body.breweryName).to.equal(newBeer.breweryName);
          expect(res.body.breweryLocation).to.contain(newBeer.breweryLocation.city);
          expect(res.body.breweryLocation).to.contain(newBeer.breweryLocation.state);
        })
    });
  });

  describe('PUT Endpoint', function() {
    it('should update fields for a beer', function() {
      const updateData = {
        beerName: "New Updated Beer Name",
        beerType: "New Updated Beer Type",
        breweryName: "New Updated Brewery Name",
        breweryLocation: {
          city: "New Updated Brewery City",
          state: "New Updated Brewery State"
        }
      };

      return Beer
        .findOne()
        .then(function(beer) {
          updateData.id = beer.id;
          return chai.request(app)
            .put(`/beers/${updateData.id}`)
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
          expect(beer.breweryLocation.city).to.equal(updateData.breweryLocation.city);
          expect(beer.breweryLocation.state).to.equal(updateData.breweryLocation.state);
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
