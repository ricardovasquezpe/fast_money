var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bidSchema = new Schema({
  id_job      : { type: String, required: true},
  id_user     : { type: String, required: true},
  status      : { type: String, required: true},
  comment     : { type: String, required: true},
  created_at  : Date,
  updated_at  : Date
});

var Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;