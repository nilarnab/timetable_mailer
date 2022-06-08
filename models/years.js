const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const YearSchema= new mongo.Schema({
    
    name: 
    {
        type: String,
        required: true,
        unique: true
    },

    
})


module.exports = mongoose.model('Years', YearSchema)