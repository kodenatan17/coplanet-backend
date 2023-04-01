module.exports = {
    index: async (req, res) => {
        try {
            res.render('index', {
                title: 'Express JS'
            });
        } catch (err) {
            console.log(err);
        }
    }
}