var express = require('express');
var router = express.Router();
const { landingPage, detailPage } = require('./controller');

/* GET home page. */
router.get('/landing-page', landingPage);
router.get('/:id/detail', detailPage);


module.exports = router;
