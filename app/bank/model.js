const mongoose = require('mongoose')

let bankSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Nama Pemilik harus diisi']
    },
    nameBank: {
        type: String,
        require: [true, 'Nama Bank harus diisi']
    },
    noRekening: {
        type: String,
        require: [true, 'Nomor Rekening Bank harus diisi']
    },
}, { timestamps: true })

module.exports = mongoose.model('Bank', bankSchema)