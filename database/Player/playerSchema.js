const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  userId: String,
  playerId: Number,
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player