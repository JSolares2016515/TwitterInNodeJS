'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const key = '152*4'

exports.ensureAuth = (req, res, next) => {
    if (!req.body.command) {
        res.send({message: 'Ingrese un comando'})
    } else {
        var commandLine = req.body.command.split(' ')
        var command = commandLine[0]
    }
    
    if (command === 'REGISTER') {
        next()
    }else if (command === 'LOGIN') {
        next()
    }else if (!req.headers.authorization) {
        return res.status(403).send({message: 'Peticion sin autenticación'})
    } else {
        var token = req.headers.authorization.replace(/[""]+/g, '')
        try {
            var payload = jwt.decode(token, key)
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({message: 'Token Expirado'})
            }
        } catch (ex) {
            return res.status(404).send({message: 'Token no válido'})
        }

        req.user = payload
        next()
    }
}
