const Bank = require('./model')

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus }
            const bank = await Bank.find()
            res.render('admin/bank/view_bank', {
                bank, alert, name: req.session.user.name,
                title: 'Halaman Bank',
            })
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/bank/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Bank',
            })
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name, nameBank, noRekeining } = req.body
            let bank = await Bank({ name, nameBank, noRekeining })
            await bank.save()

            req.flash('alertMessage', 'Berhasil tambah bank')
            req.flash('alertStatus', 'success');
            res.redirect('/bank')
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params
            const bank = await Bank.findOne({ _id: id });
            res.render('admin/bank/edit', {
                bank, name: req.session.user.name,
                title: 'Halaman Edit Bank',
            })

        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params
            const { name, nameBank, noRekening } = req.body
            await Bank.findOneAndUpdate({
                _id: id
            }, { name, nameBank, noRekening });

            req.flash('alertMessage', 'Berhasil ubah bank')
            req.flash('alertStatus', 'success');
            res.redirect('/bank')
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const trimmedId = id.trim(); // Remove any extra whitespace
            const currentBank = await Bank.findOneAndRemove({
                _id: trimmedId // Use the trimmedId in the query
            });

            if (!currentBank) {
                // Handle the case where the bank with the given id is not found
                req.flash('alertMessage', 'Bank not found');
                req.flash('alertStatus', 'danger');
                return res.redirect('/bank');
            }

            req.flash('alertMessage', 'Berhasil hapus bank');
            req.flash('alertStatus', 'success');
            res.redirect('/bank');
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },

}