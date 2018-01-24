'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();
app.use(bodyParser.json());

app.use(express.static('public'));

const {PORT, DATABASE_URL} = require('./config');
const {Beer} = require('./models');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// the following are the endpoints that are accessed through the API.
// these endpoints will return a given response depending on the operation
// and the request

// this GET endpoint will return a certain number of beers in the database

app.get('/beers', (req, res) => {
  Beer
    .find()
    .limit(4)
    .then(beers => {
      res.json({
        beers: beers.map(
          (beer) => beer.serialize()
        )
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// this GET endpoint will return a selected beer when the beer name or ID is given by the user

app.get('/beers/beername/:beerName', (req, res) => {
  Beer
    .findOne({'beerName': req.params.beerName})
    .then(beer => res.json(beer.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Interal server error'});
    });
});

app.get('/beers/:id', (req, res) => {
  Beer
    .findById(req.params.id)
    .then(beer => res.json(beer.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Interal server error'});
    });
});

// this POST endpoint will create a new beer entry in the database

app.post('/beers', (req, res) => {
  const requiredFields = ['beerName', 'beerType', 'breweryName', 'breweryLocation'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Beer
    .create({
      beerName: req.body.beerName,
      beerType: req.body.beerType,
      breweryName: req.body.breweryName,
      breweryLocation: {
        city: req.body.breweryLocation.city,
        state: req.body.breweryLocation.state,
      },
      beerABV: req.body.beerABV,
      beerIBU: req.body.beerIBU,
      beerAvailability: req.body.beerAvailability,
      beerNotes: req.body.beerNotes
    })
    .then(beer => res.status(201).json(beer.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// this PUT endpoint will update a beer selected using the ID
// the selected beer will be updated with given information given in the request

app.put('/beers/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`
    );
    console.error(message);
    return res.status(400).json({message: message});
  };

  const toUpdate = {};
  const updateableFields = ['beerName', 'beerType', 'breweryName', 'breweryLocation', 'beerABV', 'beerIBU', 'beerAvailability', 'beerNotes'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    };
  });

  Beer
    .findByIdAndUpdate(req.params.id, {$set:{
      'beerName': toUpdate.beerName,
      'beerType': toUpdate.beerType,
      'breweryName': toUpdate.breweryName,
      'breweryLocation': {
        'city': toUpdate.breweryLocation.city,
        'state': toUpdate.breweryLocation.state,
      },
      'beerABV': toUpdate.beerABV,
      'beerIBU': toUpdate.beerIBU,
      'beerAvailability': toUpdate.beerAvailability,
      'beerNotes': toUpdate.beerNotes
      }
    })
    .then(beer => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// this DELETE endpoint will delete a selected beer given the ID

app.delete('/beers/:id', (req, res) => {
  Beer
    .findByIdAndRemove(req.params.id)
    .then(blogpost => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// the following will run the server that will allow access elsewhere

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
};

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
};

if(require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
