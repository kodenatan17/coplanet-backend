const dotenv = require('dotenv');

dotenv.config()

module.exports = {
    serviceName: process.env.SERBICE_NAME,
    urlDb: process.env.MONGO_URL
}