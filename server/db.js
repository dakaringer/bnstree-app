const mongojs = require('mongojs')

const connectionURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`
module.exports = {
    db: mongojs(connectionURI),
    connectionURI: connectionURI
}
