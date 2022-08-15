const { Int32, Timestamp } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const metricSchema= new mongo.Schema({
    
    name: 
    {
        type: String,
        required: true
    },
    count:
    {
        type: Number,
        required: true
    },
    timestamp:
    {
        type: String,
        default: Date.now()
    }

})


module.exports = mongoose.model('monitoring_register', metricSchema)