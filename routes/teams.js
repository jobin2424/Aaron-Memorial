const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const teams = require('../controllers/teams')
const Team = require('../models/team');
const Player = require('../models/player');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

const { isLoggedIn, validateTeam, isAuthor} = require('../middleware')

router.route('/')
  .get(catchAsync(teams.index)) 
  .post(isLoggedIn, upload.array('image'), validateTeam, catchAsync(teams.createTeam))

router.get("/new", isLoggedIn, teams.renderNewForm)

router.route('/:id')
  .get(catchAsync(teams.showTeam))
  .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(teams.updateTeam))
  .delete(isAuthor, isLoggedIn, catchAsync(teams.deleteTeam))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( teams.renderEditForm))

module.exports = router