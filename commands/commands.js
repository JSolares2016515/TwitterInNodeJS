'use strict'

const {
    registerUser,
    loginUser,
    followUser,
    unfollowUser,
    viewProfile,
} = require('../controllers/user.controller')

const {
    addTweet,
    deleteTweet,
    editTweet,
    viewTweets,
    likeTweet,
    dislikeTweet,
    retweet,
    replyTweet,
} = require('../controllers/tweet.controller')

const commandSelection = async (req, res) => {
    const commandLine = req.body.command.split(' ')
    const command = commandLine[0]

    switch (command) {
        case 'REGISTER':
            if (commandLine.length === 5) {
                req.body.name = commandLine[1]
                req.body.email = commandLine[2]
                req.body.username = commandLine[3]
                req.body.password = commandLine[4]
                await registerUser(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break

        case 'LOGIN':
            if (commandLine.length === 3) {
                req.body.user = commandLine[1]
                req.body.password = commandLine[2]
                await loginUser(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break

        case 'FOLLOW':
            if (commandLine.length === 2) {
                req.body.username = commandLine[1]
                await followUser(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break

        case 'UNFOLLOW':
            if (commandLine.length === 2) {
                req.body.username = commandLine[1]
                await unfollowUser(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break

        case 'PROFILE':
            if (commandLine.length === 2) {
                req.body.username = commandLine[1]
                await viewProfile(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break

        case 'ADD_TWEET':
            if (commandLine.length > 1) {
                let tweetText = []
                for (let i = 1; i < commandLine.length; i++) {
                    tweetText.push(commandLine[i])
                }
                req.body.text = tweetText.join(' ')
                await addTweet(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break
        case 'DELETE_TWEET':
            if (commandLine.length === 2) {
                req.body.idTweet = commandLine[1]
                await deleteTweet(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break
        case 'EDIT_TWEET':
            if (commandLine.length > 2) {
                req.body.idTweet = commandLine[1]
                let tweetText = []
                for (let i = 2; i < commandLine.length; i++) {
                    tweetText.push(commandLine[i])
                }
                req.body.text = tweetText.join(' ')
                await editTweet(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break
        case 'VIEW_TWEETS':
            if (commandLine.length === 2) {
                req.body.username = commandLine[1]
                await viewTweets(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break
        case 'LIKE_TWEET':
            if (commandLine.length === 2) {
                req.body.idTweet = commandLine[1]
                await likeTweet(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break
        case 'DISLIKE_TWEET':
            if (commandLine.length === 2) {
                req.body.idTweet = commandLine[1]
                await dislikeTweet(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break
        case 'REPLY_TWEET':
            if (commandLine.length > 2) {
                let tweetText = []
                for (let i = 2; i < commandLine.length; i++) {
                    tweetText.push(commandLine[i])
                }
                req.body.idTweet = commandLine[1]
                req.body.text = tweetText.join(' ')
                await replyTweet(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break
        case 'RETWEET':
            if (commandLine.length > 1) {
                let tweetText = []
                for (let i = 2; i < commandLine.length; i++) {
                    tweetText.push(commandLine[i])
                }
                req.body.idTweet = commandLine[1]
                req.body.text = tweetText.join(' ')
                await retweet(req, res)
            } else {
                res.status(400).send({
                    message: 'Ingrese los datos solicitados',
                })
            }
            break
        default:
            res.send({ message: 'Comando Invalido' })
            break
    }
}

module.exports = {
    commandSelection,
}
