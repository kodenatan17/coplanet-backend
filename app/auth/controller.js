const Player = require('../player/model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const payload = req.body
            if (req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.length - 1];
                let filename = req.file.filename + '.' + originalExt;
                let target_path = path.resolve(config.routePath, `public/uploads/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest)
                src.on('end', async () => {
                    try {
                        const player = new Player({
                            ...payload, avatar: filename
                        })
                        await player.save();
                        delete player._doc.password
                        res.status(201).json({ data: player })
                    } catch (err) {
                        if (err && err.name == "ValidationError") {
                            return res.status(422).json({
                                error: 1,
                                message: err.message,
                                fields: err.errors
                            })
                        }
                        next(err)
                    }
                });
            } else {
                let player = new Player(payload)
                await player.save()
                delete player._doc.password
                res.status(201).json({ data: player })
            }
        } catch (err) {
            if (err && err.name == "ValidationError") {
                return res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
            next(err)
        }
    },
    signIn: (req, res, next) => {
        const { email, password } = req.body

        Player.findOne({ email: email }).then((player) => {

            if (player) {
                const checkPassword = bcrypt.compareSync(password, player.password)
                if (checkPassword) {
                    const token = jwt.sign({
                        player: {
                            id: player.id,
                            username: player.username,
                            name: player.name,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar
                        }
                    }, config.jwtKey)
                    res.status(200).json({
                        data: { token }
                    })
                } else {
                    res.status(403).json({
                        message: `Email atau Password yang anda masukkan salah`
                    })
                }
            } else {
                res.status(403).json({
                    message: `Email anda belum terdaftar`
                })
            }
        }).catch((e) => {
            res.status(500).json({
                message: e.message || `Internal Server Error`
            })
        })
    }
}