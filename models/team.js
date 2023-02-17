const mongoose = require("mongoose");
const Player = require("./player");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
      url: String,
      filename: String
})


ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200')
})
const TeamSchema = new Schema({
  team: String,
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }, 
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Player'
    }
  ]
  
})

TeamSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Player.deleteMany({
      _id: {
        $in: doc.players
      }
    })
  }
})

module.exports = mongoose.model('Team', TeamSchema);