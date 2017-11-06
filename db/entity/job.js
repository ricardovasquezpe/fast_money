var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobSchema = new Schema({
  title         : { type: String, required: true},
  description   : { type: String, required: true},
  id_company    : String,
  payment       : [Schema.Types.Mixed],
  photos        : Array,
  requirements  : [Schema.Types.Mixed],
  location      : [Schema.Types.Mixed],
  expiration_at : Date,
  created_at    : Date,
  updated_at    : Date,
  location_geo  : {type: [Number], index: '2d'}
});

var Job = mongoose.model('Job', jobSchema);
module.exports = Job;