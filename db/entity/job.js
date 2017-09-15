var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobSchema = new Schema({
  title: { type: String, required: true},
  description: { type: String, required: true},
  company_id: String,
  payment: [Schema.Types.Mixed],
  photos: Array,
  requirements: [Schema.Types.Mixed],
  location: [Schema.Types.Mixed],
  expiration_at: Date,
  created_at: Date,
  updated_at: Date
});

var Jon = mongoose.model('Job', jobSchema);
module.exports = Jon;