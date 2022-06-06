const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

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
    }

})

module.exports = mongoose.model('Users', UsersSchema)