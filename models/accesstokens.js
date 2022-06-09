const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')
// const { BIT } = require('mysql/lib/protocol/constants/types')
const AccessTokenSchema = new mongo.Schema({

    email:
    {
        type: String,
        required: true
    },

    access_token:
    {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('AcessTokens', AccessTokenSchema)