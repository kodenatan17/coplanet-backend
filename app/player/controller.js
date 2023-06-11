const Player = require('./model')
const Voucher = require('../voucher/model')
const Category = require('../voucher/model')

module.exports = {
    landingPage: async (req, res) => {
        try {
            const voucher = await Voucher.find().select('_id name status category thumbnail ').populate('category')
            res.status(200).json({ data: voucher, success: true })

        } catch (e) {
            res.status(500).json({ message: e.message || 'Internal server error' })
        }
    },
    detailPage: async (req, res) => {
        try {
            const { id } = req.params
            const voucher = await Voucher.findOne().select({ _id: id }).populate('category').populate('nominals').populate('user', '_id name phoneNumber')
            if (!voucher) {
                return res.status(404).json({ message: "No voucher found" })
            }
            res.status(200).json({ data: voucher })

        } catch (e) {
            res.status(500).json({ message: e.message || 'Internal server error' })
        }
    },
    category: async (req, res) => {
        try {
            const category = await Category.find()
            res.status(200).json({ data: category })
        } catch (e) {
            res.status(500).json({ message: e.message || 'Internal server error' })
        }
    }
}
