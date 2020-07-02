'use strict'

const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const userSchema = Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    follows: [{type:Schema.Types.ObjectId, ref: 'user'}],
    followers: [{type:Schema.Types.ObjectId, ref: 'user'}]
})

module.exports = Mongoose.model('user', userSchema)