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

app.get('/beers', (req, res) => {
  Beer
    .find()
    .limit(5)
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

app.get('/beers/:id', (req, res) => {
  Beer
    .findById(req.params.id)
    .then(beer => res.json(beer.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Interal server error'});
    });
});

app.post('/beers', (req, res) => {
  const requiredFields = ['beerName', 'beerType', 'breweryName'];
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
      breweryName: req.body.breweryName
    })
    .then(beer => res.status(201).json(beer.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.put('/beer/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`
    );
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['beerName', 'beerType', 'breweryName'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Beer
    .findByIdAndUpdate(req.params.id, {$set:{
      'beerName': toUpdate.beerName,
      'beerType': toUpdate.beerType,
      'breweryName': toUpdate.breweryName
      }
    })
    .then(beer => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/beers/:id', (req, res) => {
  Beer
    .findByIdAndRemove(req.params.id)
    .then(blogpost => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
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
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
