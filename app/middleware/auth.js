module.exports = {
    isLoginAdmin: (req, res, next) => {
        console.log(req.session.user)
        if (req.session.user === null || req.session.user === undefined) {
            req.flash('alertMessage', `Silahkan login kembali`)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        } else {
            next()
        }
    }
}