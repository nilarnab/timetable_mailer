const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const tablesSchema= new mongo.Schema({
    name: 
    {
        type: String,
        required: true,
        unique: true
    },

    branch_id:
    {
        type: String,
        require: true
    },

    college_id:
    {
        type: String,
        require: true
    },

    year_id:
    {
        type: String,
        require: true
    }
})


module.exports = mongoose.model('tables', tablesSchema)