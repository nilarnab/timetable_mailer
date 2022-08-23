const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const relSchema= new mongo.Schema({
    
    name: 
    {
        type: String,
        required: true
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


module.exports = mongoose.model('batch_table_rel', relSchema)