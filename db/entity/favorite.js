var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
  id_job     : { type: String, required: true},
  id_user    : { type: String, required: true},
  created_at : Date,
  updated_at : Date
});

var Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;