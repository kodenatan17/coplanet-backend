var express = require('express');
var router = express.Router();
const { signUp } = require('./controller');
const multer = require('multer');
const os = require('os');

/* GET home page. */
router.post('/sign-up', multer({ dest: os.tmpdir() }).single('image'), signUp);


module.exports = router;
