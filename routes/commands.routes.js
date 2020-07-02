'use strict'

const Express = require('express')
const {commandSelection} = require('../commands/commands')
const {ensureAuth} = require('../middlewares/authenticated')

const Router = Express.Router()

Router.post('/command', ensureAuth, commandSelection)

module.exports = Router