const Team = require('../models/team');
const Player = require('../models/player');

module.exports.createPlayer = async (req, res) => {
  const team = await Team.findById(req.params.id)
  const player = new Player(req.body.player)
  team.players.push(player)
  await player.save();
    await team.save();
    req.flash('success', 'Created New Player!')
  res.redirect(`/teams/${team._id}`)
}

module.exports.deletePlayers = async (req, res) => {
  const { id, playerId } = req.params; 
    await Team.findByIdAndUpdate(id, { $pull: { players: playerId}})
    await Player.findByIdAndDelete(playerId)
    req.flash('success', 'Successfully Deleted Player!')
    res.redirect(`/teams/${id}`)
}