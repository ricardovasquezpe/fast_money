var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name		 : String,
  lastname	 : String,
  username	 : { type: String, required: true, unique: true },
  password	 : String,
  email		 : { type: String, required: true, unique: true },
  type		 : String,
  birthdate	 : Date,
  created_at : Date,
  updated_at : Date
});

var User = mongoose.model('User', userSchema);
module.exports = User;