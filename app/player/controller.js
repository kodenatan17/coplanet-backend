const Player = require('./model')
const Voucher = require('../voucher/model')
const Category = require('../category/model')
const Bank = require('../bank/model')
const Payment = require('../payment/model')
const Nominal = require('../nominal/model')
const Transaction = require('../transaction/model')
const fs = require('fs')


module.exports = {
    landingPage: async (req, res) => {
        try {
            const voucher = await Voucher.find().select('_id name status category thumbnail ').populate('category')
            res.status(200).json({ data: voucher, success: true })

        } catch (e) {
            res.status(500).json({ message: e.message || `Internal Server Error` })
        }
    },
    detailPage: async (req, res) => {
        try {
            const voucher = await Voucher.findOne({ _id: req.params.id })
                .populate('user', '_id name phone_number')
                .populate('category')
                .populate('nominals')

            const payment = await Payment.find().populate('banks').lean()

            if (!voucher) {
                return res.status(404).json({ message: "voucher game tidak ditemukan.!" })
            }

            res.status(200).json({
                data: {
                    detail: voucher,
                    payment
                }
            })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },
    category: async (req, res) => {
        try {
            const category = await Category.find()
            console.log('Category: ', category)
            res.status(200).json({ data: category })
        } catch (e) {
            res.status(500).json({ message: e.message || `Internal Server Error` })
        }
    },
    checkout: async (req, res) => {
        try {
            const { accountUser, name, nominal, voucher, payment, bank } = req.body
            const res_voucher = await Voucher.findOne({ _id: voucher }).select('name category _id thumbnail user').populate('category').populate('user')
            if (!res_voucher) return res.status(400).json({ message: 'Voucher not found' })
            const res_nominal = await Nominal.findOne({ _id: nominal })
            if (!res_nominal) return res.status(400).json({ message: 'Nominal not found' })
            const res_payment = await Payment.findOne({ _id: payment })
            if (!res_payment) return res.status(400).json({ message: 'Payment not found' })
            const res_bank = await Bank.findOne({ _id: bank })
            if (!res_bank) return res.status(400).json({ message: 'Bank not found' })

            let tax = (10 / 100) * res_nominal._doc.price
            let value = res_nominal._doc.price + tax;
            const payload = {
                historyVoucherTopup: {
                    gameName: res_voucher._doc.name,
                    category: res_voucher._doc.category ? res_voucher._doc.category : "",
                    thumbnail: res_voucher._doc.thumbnail,
                    coinName: res_nominal._doc.coinName,
                    coinQuantity: res_nominal._doc.coinQuantity,
                    price: res_nominal._doc.price,
                },
                historyPayment: {
                    gameName: res_bank._doc.name,
                    type: res_payment._doc.type,
                    bankName: res_bank._doc.bankName,
                    noRekening: res_bank._doc.noRekening,
                },
                name: name,
                accountUser: accountUser,
                tax: tax,
                value: value,
                player: req.player._id,
                historyUser: {
                    name: res_voucher._doc.user?.name,
                    phoneNumber: res_voucher._doc.user?.phoneNumber
                },
                category: res_voucher._doc.category?._id,
                user: res_voucher._doc.user?._id
            }
            const transaction = new Transaction(payload)
            await transaction.save()
            res.status(201).json({ data: transaction })
        } catch (e) {
            res.status(500).json({ message: e.message || `Internal Server Error` })
        }
    },
    history: async (req, res) => {
        try {
            const { status = '' } = req.query
            let criteria = {}
            if (status.length) {
                criteria = {
                    ...criteria, status: { $regex: `${status}`, $options: 'i' },
                }
            }
            const history = await Transaction.findOne(criteria)
            let total = await Transaction.aggregate([
                { $match: criteria }, {
                    $group: {
                        _id: null,
                        value: { $sum: $value }
                    }
                }
            ])
            res.status(200).json({ data: history, total: total.length ? total[0].value : 0 })
        } catch (e) {
            res.status(500).json({ message: e.message || `Internal Server Error` })

        }
    },
    historyDetail: async (req, res) => {
        try {
            const { id } = req.params
            const history = await Transaction.findOne({ _id: id })
            if (!history) return res.status(404).json({ message: 'History not found' })
            res.status(200).json({ data: history })
        } catch (e) {
            res.status(500).json({ message: e.message || `Internal Server Error` })
        }
    },
    dashboard: async (req, res) => {
        try {
            const count = await Transaction.aggregate([
                { $match: { player: req.player._id } }, {
                    $group: { _id: '$category', value: { $sum: '$value' } }
                }
            ])
            const category = await Category.find()
            category.forEach(e => {
                count.forEach(d => {
                    if (d._id.toString() === e._id.toString()) {
                        d.name = e.name
                    }
                })
            })
            const history = await Transaction.find({ player: req.player._id }).populate('category').sort({ 'updatedAt': -1 })
            res.status(200).json({ data: history, count })
        } catch (e) {
            res.status(500).json({ message: e.message || `Internal Server Error` })
        }
    },
    profile: async (req, res) => {
        try {
            const data = {
                id: req.params._id,
                username: req.params.username,
                email: req.params.username,
                name: req.params.name,
                avatar: req.params.avatar,
                phoneNumber: req.params.phoneNumber
            }
            res.status(200).json({ data: data })
        } catch (e) {
            res.status(500).json({ message: e.message || `Internal Server Error` })
        }
    },
    editProfile: async (req, res) => {
        try {
            const { name = "", phoneNumber = "" } = req.body
            const payload = {}
            if (name.length) payload.name = name
            if (phoneNumber.length) payload.phoneNumber = phoneNumber

            if (req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.length - 1];
                let filename = req.file.filename + '.' + originalExt;
                let target_path = path.resolve(config.routePath, `public/uploads/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest)
                src.on('end', async () => {
                    let player = await Player.findOne({ _id: req.player._id });
                    let currentImage = `${config.routePath}/public/uploads/${player.avatar}`;
                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage)
                    }

                    player = await Player.findOneAndUpdate({
                        _id: req.player._id
                    }, {
                        ...payload,
                        avatar: filename,
                    }, { new: true, runValidators: true })
                    res.status(201).json({ data: { id: player.id, name: player.name, phoneNumber: player.phoneNumber, avatar: player.avatar } })
                });
                src.on('err', async () => { next() })
            } else {
                const player = await Player.findOneAndUpdate({ _id: req.player._id }, payload, { new: true, runValidators: true })
                res.status(201).json({ data: { id: player.id, name: player.name, phoneNumber: player.phoneNumber, avatar: player.avatar } })
            }
        } catch (err) {
            if (err && err.name === 'ValidationError') {
                res.status(422).json({ error: 1, message: err.message, fields: err.errors })
            }
        }
    }
}
