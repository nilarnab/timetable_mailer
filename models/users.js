const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')
// const { BIT } = require('mysql/lib/protocol/constants/types')

const UsersSchema = new mongo.Schema({
    email: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    super:
    {
        type: Number,
        required: true
    },
    password:
    {
        type: String,
    },
    mail_verified: {
        type: Number,
        default: 0
    },
    enabled: 
    {
        type: Number,
        default: 1
    },
    token:
    {
        type: String,
        required: true
    },
    batch: 
    {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Users', UsersSchema)


