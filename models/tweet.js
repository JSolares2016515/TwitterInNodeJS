'use strict'

const Mongoose =  require('mongoose')

const Schema = Mongoose.Schema

const tweetSchema = Schema({
    text: String,
    date: Date,
    user: {type:Schema.Types.ObjectId, ref:'user'}
})

module.exports = Mongoose.model('tweet', tweetSchema)