var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyBqtW4xDKpJG49iSCQViQoKQSWPEcRjmgw',
  formatter: null
};
module.exports = NodeGeocoder(options);