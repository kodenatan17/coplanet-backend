const mongoose = require('mongoose')

let playerSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'email harus diisi']
    },
    name: {
        type: String,
        require: [true, 'name harus diisi'],
        maxlength: [225, 'panjang harus antara 3-225 karakter'],
        minlength: [3, 'panjang harus antara 3-225 karakter'],
    },
    username: {
        type: String,
        require: [true, 'password harus diisi'],
        maxlength: [225, 'panjang harus antara 3-225 karakter'],
        minlength: [3, 'panjang harus antara 3-225 karakter'],
    },
    username: {
        type: String,
        require: [true, 'password harus diisi'],
        maxlength: [225, 'panjang harus antara 8-225 karakter'],
        minlength: [8, 'panjang harus antara 8-225 karakter'],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    role: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    avatar: {
        type: String,
    },
    fileName: { type: String },
    phoneNumber: {
        type: String,
        require: [true, 'phone number harus diisi'],
        maxlength: [13, 'panjang harus antara 9-13 karakter'],
        minlength: [9, 'panjang harus antara 9-13 karakter'],
    },
    favorit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true })

module.exports = mongoose.model('Player', playerSchema)