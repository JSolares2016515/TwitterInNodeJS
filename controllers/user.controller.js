'use strict'

const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('../services/jwt')

const registerUser = async (req, res) => {
    const { name, email, username, password } = req.body
    const newUser = UserModel()

    try {
        const userFound = await UserModel.findOne({ username: username })
        if (userFound) {
            res.send({ message: 'Nombre de usuario ya utilizado' })
        } else {
            const hashPassword = await bcrypt.hash(
                password,
                await bcrypt.genSalt(4)
            );
            if (hashPassword) {
                newUser.name = name
                newUser.email = email
                newUser.username = username
                newUser.password = hashPassword
                const userRegistered = await newUser.save()
                if (userRegistered) {
                    res.send({ 'User Registered': userRegistered })
                } else {
                    res.status(503).send({
                        message: 'Usuario no registrado, intente más tarde',
                    })
                }
            } else {
                res.status(500).send({ message: 'Error al encriptar' })
            }
        }
    } catch (e) {
        res.status(500).send({ message: 'Error en la base de datos' })
    }
}

const loginUser = async (req, res) => {
    const { user, password } = req.body

    try {
        const userFound = await UserModel.findOne({$or: [{username: user}, {email: user}]})
        if (userFound) {
            const comparedPassword = await bcrypt.compare(password, userFound.password)
            if (comparedPassword === true) {
                res.send({token: jwt.createToken(userFound)})
            } else {
                res.status(503).send({message: 'Usuario o contraseña erroneas'})
            }
        } else {
            res.status(503).send({message: 'Usuario o contraseña erroneas'})
        }
    } catch (e) {
        res.status(500).send({message: 'Error en la base datos'})
    }
}

const followUser = async (req, res) => {
    const {username} = req.body
    const {sub} = req.user

    try {
        const userFound = await UserModel.findOneAndUpdate({username: username}, {$push: {followers: sub}}, {new: true})
        if (userFound) {
            const followedCorrectly = await UserModel.findByIdAndUpdate(sub, {$push: {follows: userFound._id}}, {new: true})
            res.send({'User Followed': followedCorrectly})
        } else {
            res.status(503).send({message: 'Usuario no encontrado'})
        }
    } catch (e) {
        res.status(500).send({message: 'Error en la base datos'})
    }
}

const unfollowUser = async (req, res) => {
    const {username} = req.body
    const {sub} = req.user

    try {
        const userFound = await UserModel.findOneAndUpdate({username: username}, {$pull: {followers: sub}}, {new: true})
        if (userFound) {
            const unfollowedCorrectly = await UserModel.findByIdAndUpdate(sub, {$pull: {follows: userFound._id}}, {new: true})
            res.send({'User Unfollowed': unfollowedCorrectly})
        } else {
            res.status(503).send({message: 'Usuario no encontrado'})
        }
    } catch (e) {
        res.status(500).send({message: 'Error en la base datos'})
    }
}

const viewProfile = async (req, res) => {
    const {username} = req.body

    try {
        const userFound = await UserModel.findOne({username: username})
        if (userFound) {
            res.send({'User': userFound})
        } else {
            res.status(503).send({message: 'Usuario no encontrado'})
        }
    } catch (e) {
        res.status(500).send({message: 'Error en la base datos'})
    }
}

module.exports = {
    registerUser,
    loginUser,
    followUser,
    unfollowUser,
    viewProfile
}
