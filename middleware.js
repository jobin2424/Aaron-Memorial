const ExpressError = require('./utils/expressError')
const { teamSchema } = require('./schemas.js')
const Team = require('./models/team')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
         req.session.returnTo = req.originalUrl
    req.flash('error', 'you must be signed in first!')
    return res.redirect('/login')
     }
    next()
}

module.exports.validateTeam = (req, res, next) => {
  const {error} = teamSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
  throw new ExpressError(msg, 400)
  } else {
  next()
}
}

module.exports.isAuthor = async (req, res, next) => {
     const { id } = req.params;
  const team = await Team.findById(id)

  if (!team.author.equals(req.user._id)) {
    req.flash('error', 'You dont have permission to do that!')
    return res.redirect(`/teams/${id}`)
  }
  next()
}