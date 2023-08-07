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
                        if (player.password && typeof player.password === 'string') {
                            const saltRounds = 10; // You can adjust the number of salt rounds as needed.
                            player.password = bcrypt.hashSync(player.password, saltRounds);
                        }
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
    signIn: async (req, res, next) => {
        const { email, password } = req.body

        Player.findOne({ email: email }).then((player) => {

            console.log('Stored Hashed Password:', player.password);
            console.log('Provided Password:', password);
            if (player) {
                const checkPassword = bcrypt.compareSync(password, player.password)
                if (checkPassword) {
                    const token = jwt.sign({
                        id: player.id,
                        username: player.username,
                        email: player.email,
                        name: player.name,
                        phoneNumber: player.phoneNumber,
                        avatar: player.avatar
                    }, config.jwtKey)

                    res.status(200).json({
                        data: { token }
                    })
                } else {
                    res.status(403).json({
                        message: 'password atau email yang anda masukan salah'
                    })
                }

            } else {
                res.status(403).json({
                    message: 'email yang anda masukan belum terdaftar'
                })
            }
        }).catch((err) => {
            res.status(500).json({
                message: err.message || `Internal Server Error`
            })
        })



    }
}