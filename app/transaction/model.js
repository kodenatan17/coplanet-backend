const mongoose = require('mongoose')

let transactionSchema = mongoose.Schema({
    historyVoucherTopup: {
        gameName: { type: String, require: [true, 'harus diisi name'] },
        category: { type: String, require: [true, 'harus diisi category'] },
        thumbnail: { type: String, require: [true, 'harus diisi thumbnail'] },
        coinName: { type: String, require: [true, 'harus diisi coin name'] },
        coinQuantity: { type: String, require: [true, 'harus diisi coin quantity'] },
        price: { type: String, require: [true, 'harus diisi price'] },
    },

    historyPayment: {
        gameName: { type: String, require: [true, 'harus diisi nama'] },
        type: { type: String, require: [true, 'harus diisi type'] },
        bankName: { type: String, require: [true, 'harus diisi nama bank'] },
        noRekening: { type: String, require: [true, 'harus diisi no rekening'] },
    },
    name: {
        type: String,
        require: [true, 'harus diisi nama'],
        maxlength: [225, 'panjang harus antara 3-225 karakter'],
        minlength: [3, 'panjang harus antara 3-225 karakter'],
    },
    accountUser: {
        type: String,
        require: [true, 'harus diisi nama'],
        maxlength: [225, 'panjang harus antara 3-225 karakter'],
        minlength: [3, 'panjang harus antara 3-225 karakter'],
    },
    tax: {
        type: Number,
        default: 0,
    },
    value: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    },
    historyUser: {
        name: {
            type: String, require: [true, 'harus diisi name']
        },
        phoneNumber: {
            type: Number,
            require: [true, 'harus diisi phone number'],
            maxlength: [13, 'panjang harus anatara 9-13 karakter'],
            minlength: [9, 'panjang harus anatara 9-13 karakter'],
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
    { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)