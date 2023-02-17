const express = require('express')
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
const Team = require('../models/team');
const Player = require('../models/player');
const players = require('../controllers/players')


router.post("/", catchAsync(players.createPlayer))

router.delete('/:playerId', catchAsync(players.deletePlayers))

module.exports = router