'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/beer-application';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-beer-application';
exports.PORT = process.env.PORT || 8080;
