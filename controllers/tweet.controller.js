'use strict'

const TweetModel = require('../models/tweet')
const UserModel = require('../models/user')
const ResponseModel = require('../models/response')

const addTweet = async (req, res) => {
    const { text } = req.body
    const newTweet = TweetModel()
    try {
        newTweet.text = text
        newTweet.user = req.user.sub
        newTweet.date = new Date()
        const tweetAdded = await newTweet.save()
        if (tweetAdded) {
            res.send({ 'Tweet Added': tweetAdded })
        } else {
            res.status(503).send({
                message: 'Tweet no creado, intente más tarde',
            })
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
            res.send({ 'Tweet Deleted': tweetDeleted })
        } else {
            res.status(503).send({
                message: 'Tweet no eliminado, intente más tarde',
            })
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

const editTweet = async (req, res) => {
    const { idTweet, text } = req.body
    try {
        const tweetUpdated = await TweetModel.findByIdAndUpdate(
            idTweet,
            { text: text },
            { new: true }
        )
        if (tweetUpdated) {
            res.send({ 'Tweet Updated': tweetUpdated })
        } else {
            res.status(503).send({
                message: 'Tweet no editado, intente más tarde',
            })
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

// const viewTweets = async (req, res) => {
//     const { username } = req.body
//     try {
//         const userFound = await UserModel.findOne({ username: username })
//         if (userFound) {
//             const tweets = await TweetModel.find({ user: userFound._id })
//             if (tweets.length > 0) {
//                 res.send({ Tweets: tweets })
//             } else {
//                 res.send({ message: 'El usuario no tiene ningún tweet' })
//             }
//         } else {
//             res.send({ message: 'Usuario no encontrado' })
//         }
//     } catch (e) {
//         res.status(500).send({ message: 'Error en la base de datos' })
//     }
// }

const likeTweet = async (req, res) => {
    const idUser = req.user.sub
    const { idTweet } = req.body
    try {
        const tweetFound = await TweetModel.findById(idTweet)
        if (tweetFound) {
            const tweetLiked = await TweetModel.find({
                _id: idTweet,
                likes: idUser,
            })
            console.log(tweetLiked)
            if (tweetLiked.length > 0) {
                res.send({ message: 'Ya se le ha dado like al Tweet' })
            } else {
                const tweetUpdated = await TweetModel.findByIdAndUpdate(
                    idTweet,
                    { $push: { likes: idUser } },
                    { new: true }
                )
                if (tweetUpdated) {
                    res.send({ message: tweetUpdated })
                } else {
                    res.status(503).send({ message: 'Error al dar like' })
                }
            }
        } else {
            res.send({ message: 'Tweet no encontrado' })
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

const dislikeTweet = async (req, res) => {
    const idUser = req.user.sub
    const { idTweet } = req.body
    try {
        const tweetFound = await TweetModel.findById(idTweet)
        if (tweetFound) {
            const tweetLiked = await TweetModel.find({
                _id: idTweet,
                likes: idUser,
            })
            if (tweetLiked.length > 0) {
                const tweetUpdated = await TweetModel.findByIdAndUpdate(
                    idTweet,
                    { $pull: { likes: idUser } },
                    { new: true }
                )
                if (tweetUpdated) {
                    res.send({ message: tweetUpdated })
                } else {
                    res.status(503).send({ message: 'Error al dar dislike' })
                }
            } else {
                res.send({ message: 'Error al dar dislike' })
            }
        } else {
            res.send({ message: 'Tweet no encontrado' })
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

const replyTweet = async (req, res) => {
    const idUser = req.user.sub
    const { idTweet, text } = req.body
    const newResponse = ResponseModel()
    try {
        const tweetFound = await TweetModel.findById(idTweet)
        if (tweetFound) {
            newResponse.text = text
            newResponse.user = idUser
            newResponse.date = new Date()
            newResponse.tweet = idTweet
            const responseAdded = await newResponse.save()
            if (responseAdded) {
                const responsesTweet = await ResponseModel.find({
                    tweet: idTweet,
                })
                if (responsesTweet.length > 0) {
                    res.send({ replies: responsesTweet })
                } else {
                    res.send({ message: 'No se ha podido responder el tweet' })
                }
            } else {
                res.send({ message: 'No se ha podido responder el tweet' })
            }
        } else {
            res.send({ message: 'Tweet no encontrado' })
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

const retweet = async (req, res) => {
    const idUser = req.user.sub
    const { idTweet, text } = req.body
    const newTweet = TweetModel()
    try {
        const tweetFound = await TweetModel.findById(idTweet)
        if (tweetFound) {
            const retweetExist = await TweetModel.find({
                user: idUser,
                retweetof: idTweet
            })
            console.log(retweetExist)
            if (retweetExist.length > 0) {
                const retweetDeleted = await TweetModel.findByIdAndDelete(retweetExist[0]._id)
                if (retweetDeleted) {
                    res.send({'Retweet Delete': retweetDeleted})
                } else {
                    res.send({message: 'Error al eliminar el retweet'})
                }
            } else {
                newTweet.user = idUser
                newTweet.date = new Date()
                newTweet.retweetof = idTweet
                if (text) { newTweet.text = text } 
                const retweetAdded = await newTweet.save()
                if (retweetAdded) {
                    res.send({ 'Retweet Added': retweetAdded })
                } else {
                    res.status(503).send({
                        message: 'Retweet no creado, intente más tarde',
                    })
                }
            }
        } else {
            res.send({ message: 'Tweet no encontrado' })
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

const viewTweets = async (req, res) => {
    const { username } = req.body
    let counter = 0
    let allStats = []
    let stats = { tweet: '', likes: 0, replies: 0, retweets: 0 }
    try {
        const userFound = await UserModel.findOne({ username: username })
        if (userFound) {
            const tweets = await TweetModel.find({ user: userFound._id, retweetof: null})
            if (tweets.length > 0) {
                console.log(tweets)
                tweets.forEach(async tweet => {
                    const tweetReplies = await ResponseModel.find({tweet: tweet._id})
                    const tweetRetweets = await TweetModel.find({retweetof: tweet._id})
                    stats.tweet = tweet._id
                    stats.likes = tweet.likes.length
                    stats.replies = tweetReplies.length
                    stats.retweets = tweetRetweets.length
                    allStats.push(stats)
                    stats = { tweet: '', likes: 0, replies: 0, retweets: 0 }
                    counter++
                    if (counter === tweets.length) {
                        res.send({' Tweets Stats': allStats})
                    }
                })
            } else {
                res.send({ message: 'El usuario no tiene ningún tweet' })
            }
        } else {
            res.send({ message: 'Usuario no encontrado' })
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

module.exports = {
    addTweet,
    deleteTweet,
    editTweet,
    viewTweets,
    likeTweet,
    dislikeTweet,
    replyTweet,
    retweet
}
