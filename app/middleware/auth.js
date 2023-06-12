const config = require('../../config')
const jwt = require('jsonwebtoken')

const Player = require('../player/model')
module.exports = {
    isLoginAdmin: (req, res, next) => {
        console.log(req.session.user)
        if (req.session.user === null || req.session.user === undefined) {
            req.flash('alertMessage', `Silahkan login kembali`)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        } else {
            next()
        }
    },
    isAuth: async (req, res, next) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer', '') : null
            const data = jwt.verify(token, config.jwtKey)
            const player = await Player.findOne({ _id: data.player.id })
            if (!player) {
                throw new Error()
            }
            req.player = player
            req.token = token
            next()
        } catch (e) {
            res.status(401).json({
                error: `Not Authorized to access`
            })
        }
    }
}