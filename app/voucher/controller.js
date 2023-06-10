const Voucher = require('./model')
const Category = require('../category/model')
const Nominal = require('../nominal/model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus }
            const voucher = await Voucher.find().populate('category').populate('nominals')
            res.render('admin/voucher/view_voucher', {
                voucher, alert, name: req.session.user.name,
                title: 'Halaman Voucher',
            })
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    viewCreate: async (req, res) => {
        try {
            const category = await Category.find()
            const nominal = await Nominal.find()
            res.render('admin/voucher/create', { category, nominal })
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name, category, nominals } = req.body

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
                        const voucher = new Voucher({
                            name,
                            category,
                            nominals,
                            thumbnail: filename,
                        })
                        await voucher.save();

                        req.flash('alertMessage', 'Berhasil tambah voucher')
                        req.flash('alertStatus', 'success');
                        res.redirect('/voucher', {
                            name: req.session.user.name,
                            title: 'Halaman Tambah Voucher',
                        })
                    } catch (err) {
                        req.flash('alertMessage', `${err.message}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/nominal')
                    }
                });
            } else {
                const voucher = new Voucher({
                    name,
                    category,
                    nominals,
                })
                await voucher.save();

                req.flash('alertMessage', 'Berhasil tambah voucher')
                req.flash('alertStatus', 'success');
                res.redirect('/voucher')
            }
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params
            const category = await Category.find()
            const nominal = await Nominal.find()
            const voucher = await Voucher.findOne({ _id: id }).populate('category').populate('nominals')
            res.render('admin/voucher/edit', {
                voucher, nominal, category, name: req.session.user.name,
                title: 'Halaman Tambah Voucher',
            })

        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params
            const { name, category, nominals } = req.body

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
                        const currentVoucher = await Voucher.findOne({ _id: id })

                        let currentImage = `${config.routePath}/public/uploads/${currentVoucher.thumbnail}`;
                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage)
                        }

                        await Voucher.findOneAndUpdate({
                            _id: id
                        }, {
                            name,
                            category,
                            nominals,
                            thumbnail: filename,
                        })

                        req.flash('alertMessage', 'Berhasil ubah voucher')
                        req.flash('alertStatus', 'success');
                        res.redirect('/voucher'), {
                            name: req.session.user.name,
                            title: 'Halaman Ubah Voucher',
                        }
                    } catch (err) {
                        req.flash('alertMessage', `${err.message}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/nominal')
                    }
                });
            } else {
                await Voucher.findOneAndUpdate({
                    _id: id
                }, {
                    name,
                    category,
                    nominals,
                })

                req.flash('alertMessage', 'Berhasil ubah voucher')
                req.flash('alertStatus', 'success');
                res.redirect('/voucher')
            }

            await Nominal.findOneAndUpdate({
                _id: id
            }, { coinName, coinQuantity, price });

            req.flash('alertMessage', 'Berhasil ubah nominal')
            req.flash('alertStatus', 'success');
            res.redirect('/nominal')
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params
            await Voucher.findOneAndRemove({
                _id: id
            });

            let currentImage = `${config.routePath}/public/uploads/${currentVoucher.thumbnail}`;
            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage)
            }

            req.flash('alertMessage', 'Berhasil hapus voucher')
            req.flash('alertStatus', 'success');
            res.redirect('/voucher')
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionStatus: async (req, res) => {
        try {
            const { id } = req.params
            const voucher = await Voucher.findOne({ id: id })

            let status = voucher.status === 'Y' ? 'N' : 'Y'

            voucher = await Voucher.findOneAndUpdate({
                _id: id
            }, { status })
            req.flash('alertMessage', 'Berhasil ubah status')
            req.flash('alertStatus', 'success');
            res.redirect('/voucher')
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    }

}