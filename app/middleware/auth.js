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
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer', '').trim() : null;
            console.log('token', token)
            if (!token) {
                throw new Error('Token missing in request header');
            }

            const data = jwt.verify(token, config.jwtKey);
            const player = await Player.findOne({ _id: data.id });
            if (!player) {
                throw new Error('Player not found');
            }

            req.player = player;
            req.token = token;
            next();
        } catch (e) {
            console.error('Authentication error:', e);
            res.status(401).json({
                error: 'Not Authorized to access',
            });
        }
    }
}
