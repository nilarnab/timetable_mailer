const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const mailqueueSchema= new mongo.Schema({
    
    body: 
    {
        type: String,
        required: true
    },
    year: 
    {
        type: String,
        required: true
    },
    branch:
    {
        type: String,
        required: true
    },
    college:
    {
        type: String,
        required: true
    },
    predicted_affected:
    {
        type: Number
    },
    done:
    {
        type: Number,
        default: 0
    }

})


module.exports = mongoose.model('MailQueue', mailqueueSchema)