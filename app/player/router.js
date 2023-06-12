var express = require('express');
var router = express.Router();
const { landingPage, detailPage, category, checkout, history, historyDetail } = require('./controller');
const { isAuth } = require('../middleware/auth');

/* GET home page. */
router.get('/landing-page', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', category);
router.post('/check-out', isAuth, checkout);
router.get('/history', isAuth, history);
router.get('/history/:id/detail', isAuth, historyDetail);

module.exports = router;
