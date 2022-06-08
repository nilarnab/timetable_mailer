const { Int32 } = require('mongodb')
const { default: mongoose } = require('mongoose')
const mongo = require('mongoose')

const ScheduleSchema= new mongo.Schema({
    
    table_name: 
    {
        type: String,
        required: true,
    },

    course_name: 
    {
        type: String,
        required: true
    },

    teacher:
    {
        type: String,
        required: true
    },

    day:
    {
        type: String,
        required: true,
    },

    per_id:
    {
        type: String,
        required: true
    }
    

})


module.exports = mongoose.model('Schedules', ScheduleSchema)