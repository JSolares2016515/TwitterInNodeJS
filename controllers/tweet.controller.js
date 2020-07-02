'use strict'

const TweetModel = require('../models/tweet')
const UserModel = require('../models/user')

const addTweet = async(req, res) => {
    const { text } = req.body
    const newTweet = TweetModel()
    try {
        newTweet.text = text
        newTweet.user = req.user.sub
        newTweet.date = new Date()
        const tweetAdded = await newTweet.save()
        if (tweetAdded) {
            res.send({'Tweet Added': tweetAdded})
        } else {
            res.status(503).send({message: 'Tweet no creado, intente más tarde'})
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

const deleteTweet = async (req, res) => {
    const { idTweet } = req.body
    try {
        const tweetDeleted = await TweetModel.findByIdAndDelete(idTweet)
        if (tweetDeleted) {
            res.send({'Tweet Deleted': tweetDeleted})
        } else {
            res.status(503).send({message: 'Tweet no eliminado, intente más tarde'})
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

const editTweet = async (req, res) => {
    const { idTweet, text } = req.body
    try {
        const tweetUpdated = await TweetModel.findByIdAndUpdate(idTweet, {text: text}, {new: true})
        if (tweetUpdated) {
            res.send({'Tweet Updated': tweetUpdated})
        } else {
            res.status(503).send({message: 'Tweet no editado, intente más tarde'})
        }
    } catch (e) {
        res.status(500).send({message: 'Error en la base de datos'})
    }
}

const viewTweets = async (req, res) => {
    const { username } = req.body
    try {
        const userFound = await UserModel.findOne({username: username})
        if (userFound) {
            const tweets = await TweetModel.find({user: userFound._id})
            if (tweets.length > 0) {
                res.send({'Tweets': tweets})
            } else {
                res.send({message: 'El usuario no tiene ningún tweet'})
            }
        } else {
            res.send({message: 'Usuario no encontrado'})
        }
    } catch (e) {
        res.status(500).send({message: 'Error en la base de datos'})
    }
}

module.exports = {
    addTweet,
    deleteTweet,
    editTweet,
    viewTweets
}