const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  team: String,
  name: String,
  number: Number
});


module.exports = mongoose.model('Player', PlayerSchema);



