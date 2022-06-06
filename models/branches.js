const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const BranchSchema= new mongo.Schema({
    
    short_name: 
    {
        type: String,
        required: true,
        unique: true
    },

    full_name:
    {
        type: String,
    }
    
    

})


module.exports = mongoose.model('Branches', BranchSchema)