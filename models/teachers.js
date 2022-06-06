const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const TeachersSchema= new mongo.Schema({
    name: 
    {
        type: String,
        required: true
    },
    college_id:
    {
        type: String,
        required: true
    },
    branch_id:
    {
        type: String,
        required: true
    }

})


module.exports = mongoose.model('teachers', TeachersSchema)