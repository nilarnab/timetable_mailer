const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const tablesSchema= new mongo.Schema({
    name: 
    {
        type: String,
        required: true
    },
})


module.exports = mongoose.model('tables', tablesSchema)