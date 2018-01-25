'use strict';

const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  beerName: {type: String, required: true, unique: true},
  beerType: {type: String, required: true},
  breweryName: {type: String, required: true},
  breweryLocation: {
    city: {type: String, required: true},
    state: {type: String, required: true}
  },
  beerABV: Number,
  beerIBU: Number,
  beerAvailability: String,
  beerNotes: String
});

beerSchema.virtual('breweryAddress').get(function() {
  return `${this.breweryLocation.city}, ${this.breweryLocation.state}`.trim()
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
