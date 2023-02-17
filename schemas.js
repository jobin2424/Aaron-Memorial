const Joi = require('joi')

 module.exports.teamSchema = Joi.object({
    team: Joi.object({
      team: Joi.string().required()
    }).required()
 })


