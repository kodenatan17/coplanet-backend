const Category = require('./model')

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus }
            const category = await Category.find()
            res.render('admin/category/view_category', {
                category, alert, name: req.session.user.name,
                title: 'Halaman Category',
            })
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    viewCreate: async (req, res) => {
        try {
            res.render('admin/category/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Category',
            })
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const { name } = req.body
            let category = await Category({ name })
            await category.save()

            req.flash('alertMessage', 'Berhasil tambah kategori')
            req.flash('alertStatus', 'success');
            res.redirect('/category')
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    viewEdit: async (req, res) => {
        try {
            const { id } = req.params
            const category = await Category.findOne({ _id: id });
            res.render('admin/category/edit', {
                category, name: req.session.user.name,
                title: 'Halaman Ubah Category',
            })

        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionEdit: async (req, res) => {
        try {
            const { id } = req.params
            const { name } = req.body
            await Category.findOneAndUpdate({
                _id: id
            }, { name });

            req.flash('alertMessage', 'Berhasil ubah kategori')
            req.flash('alertStatus', 'success');
            res.redirect('/category')
        } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const trimmedId = id.trim(); // Remove any extra whitespace
            const currentCategory = await Category.findOneAndRemove({
                _id: trimmedId // Use the trimmedId in the query
            });

            if (!currentCategory) {
                // Handle the case where the category with the given id is not found
                req.flash('alertMessage', 'Category not found');
                req.flash('alertStatus', 'danger');
                return res.redirect('/category');
            }

            req.flash('alertMessage', 'Berhasil hapus kategori');
            req.flash('alertStatus', 'success');
            res.redirect('/category');
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },

}