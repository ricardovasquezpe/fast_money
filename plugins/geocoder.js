var NodeGeocoder = require('node-geocoder');
var options = {
  provider    : 'google',
  httpAdapter : 'https',
  apiKey      : 'AIzaSyAS94i2CrSbTbxP9Md9Mq8Zsc_2-aiaals',
  formatter   : null
};
module.exports = NodeGeocoder(options);