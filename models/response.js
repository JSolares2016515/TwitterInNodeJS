'use strict'

const Mongoose =  require('mongoose')

const Schema = Mongoose.Schema

const responseSchema = Schema({
    text: String,
    date: Date,
    user: {type:Schema.Types.ObjectId, ref:'user'},
    tweet: {type:Schema.Types.ObjectId, ref:'tweet'}
})

module.exports = Mongoose.model('response', responseSchema)