'use strict';

const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  beerName: {type: String, required: true},
  beerType: {type: String, required: true},
  breweryName: {type: String, required: true},
  breweryLocation: {
    building: String,
    street: String,
    city: String,
    state: String,
    zipcode: String
  },
  beerABV: Number,
  beerIBU: Number,
  beerAvailability: String,
  beerNotes: String
});

beerSchema.virtual('breweryAddress').get(function() {
  return `${this.breweryLocation.building} ${this.breweryLocation.street}, ${this.breweryLocation.city}, ${this.breweryLocation.state} ${this.breweryLocation.zipcode}`.trim()
});

beerSchema.methods.serialize = function() {
  return {
    id: this._id,
    beerName: this.beerName,
    beerType: this.beerType,
    breweryName: this.breweryName,
    breweryLocation: this.breweryAddress,
    beerABV: this.beerABV,
    beerIBU: this.beerIBU,
    beerAvailability: this.beerAvailability,
    beerNotes: this.beerNotes
  };
};

const Beer = mongoose.model('Beer', beerSchema);

module.exports = {Beer};
