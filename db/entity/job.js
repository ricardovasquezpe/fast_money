var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  title: String,
  description: { type: String, required: true, unique: true },
  company_id: String,
  payment: Object,
  photos: Array,
  requirements: Array,
  expiration_at: Date,
  created_at: Date,
  updated_at: Date
});

var User = mongoose.model('User', userSchema);
module.exports = User;