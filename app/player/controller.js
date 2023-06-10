const Player = require('./model')
const Voucher = require('../voucher/model')

module.exports = {
    landingPage: async (req, res) => {
        try {
            const voucher = await Voucher.find().select('_id name status category thumbnail ').populate('category')
            res.status(200).json({ data: voucher })

        } catch (e) {
            res.status(500).json({ message: e.message || 'Terjadi kesalahan pada server' })
        }
    }
}
