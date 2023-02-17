const Team = require('../models/team');
const Player = require('../models/player');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })


module.exports.index = async (req, res) => {
  const teams = await Team.find({});
  res.render("teams/index", { teams }); 
}

module.exports.renderNewForm =  (req, res) => {
  res.render('teams/new');
}

module.exports.createTeam = async (req, res, next) => {
    const team = new Team(req.body.team);
    team.images =     req.files.map(f => ({url: f.path, filename: f.filename}))
  team.author = req.user._id
  await team.save();
    req.flash('success', 'Successfully made a new Team!')
    res.redirect(`/teams/${team._id}`)
 
}

module.exports.showTeam = async (req, res) => {
  const teams = await Team.findById(req.params.id).populate('players').populate('author')
  const teamPlayers = await Player.find({});
  if (!teams) {
    req.flash('error', 'Cannot Find That Team');
    res.redirect('/teams');
  }
  res.render("teams/show", { teams, teamPlayers } );
}

module.exports.renderEditForm = async (req, res) => {
   const { id } = req.params;
  const teams = await Team.findById(id)
    if (!teams) {
    req.flash('error', 'Cannot find that Team!')
    return res.redirect('/teams')
    }
res.render("teams/edit", { teams } );
}

module.exports.updateTeam = async (req, res) => {
   const { id } = req.params;
    const team = await Team.findByIdAndUpdate(id, { ...req.body.team })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    team.images.push(...imgs)
   await team.save()
  req.flash('success', 'Succefully updated Team')
  res.redirect(`/teams/${team._id}`)
}

module.exports.deleteTeam = async (req, res) => {
    const { id } = req.params;
    await Team.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Team !')
    res.redirect('/teams')
}