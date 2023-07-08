var express = require('express');
var router = express.Router();
const { signUp, signIn } = require('./controller');
const multer = require('multer');
const os = require('os');
const cors = require('cors');

/* GET home page. */
router.post('/sign-up', cors(), multer({ dest: os.tmpdir() }).single('image'), signUp);
router.post('/sign-in', cors(), signIn);

module.exports = router;
