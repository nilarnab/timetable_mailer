const express = require('express');
const res = require('express/lib/response');
const {
    json
} = require('express/lib/response');
const router = express.Router();
const Users = require('../models/users');
const College = require("../models/colleges")
const Branch = require("../models/branches")
const Year = require("../models/years")
const Resource = require("../models/resources")
const Table = require("../models/tables")
const Schedule = require("../models/schedule")
const Relation = require("../models/BatchTableRel")
const Teacher = require("../models/teachers")
const AccessToken = require("../models/accesstokens")

middleware = require("../middlewares/auth.js")



router.get('/start_engine', async (req, res, next) => {

    // getting week day
    const weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    const d = new Date();
    let day = weekday[d.getDay()];
    

    console.log('day found as ' + day)


    // validation for request
    // engineKey = req.params.engineKey

    // var valid_key = await Resource.find({'EngineKey': engineKey})

    if ( /*valid_key.length == 0 ||*/ 0) {
        return res.status(403).send('Forbidden')
    } else {

        // gained access
        console.log('Engine Key OK')
        console.log('Preparing to start the engine, gathering all users')


        // gathering all the users

        var users = await Users.find({})

        console.log('all users')
        console.log(users)

        // for each user
        users.forEach(async (user, index) => {
            console.log('Trying to mail ' + user.email)

            // fiding appropriate table
            var table_name = await Relation.find({
                batch_id: user.batch,
                college_id: user.college,
                year_id: user.year
            })

            var all_tables = await Relation.find({})
            console.log(all_tables)

            if (table_name.length == 0) {
                console.log("No linked table found for " + user.email)
            } else {
                table_name = table_name[0].name
                console.log("Linked table name found as " + table_name)


                var schedule = [];

                var per_ids_array = ['1', '2', '3', '4', '5', '6', '7', '8']

                var cnt = 0

                per_ids_array.forEach(async (per_id, index) => {

                    var schedule_entry = await Schedule.find({
                        table_name: table_name,
                        day: day,
                        per_id: per_id
                    })

                    cnt += 1
                    console.log('cnt is ' + cnt)

                    if (schedule_entry.length == 0) {

                    } else {
                        console.log('shedule entry')
                        schedule_entry = schedule_entry[0]
                        console.log(schedule_entry)

                        schedule.push({
                            'per_id': per_id,
                            'teacher': schedule_entry.teacher,
                            course_name: schedule_entry.course_name
                        })

                        console.log('taking in ' + console.log(schedule_entry.teacher))

                    }

                    if (cnt == per_ids_array.length) {

                        console.log('count complete')


                        console.log('gathered data')
                        console.log(schedule)

                        var subject = 'Your timetable today'
                        var body = '<h4>Hi</h4><p>Your schedule today</p>'

                        console.log('in busy loading')
                        

                        
                        schedule.forEach( async (entry, index) => {
                            var teacher_entry = await Teacher.findById(entry.teacher)
                            console.log(teacher_entry)
                            body += '<p>at period: ' + entry.per_id + ' you have ' + entry.course_name + ' by ' + teacher_entry.name + '</p>'

                            if (index + 1 == schedule.length)
                            {
                                body += '<p>Thanks</p>'
                                body += '<p>MailerBot</p>'

                                sendMail(user.email, subject, body)

                                console.log("complete for user", user.email)

                            }
                        })

                        

                        

                    }


                })







            }

            

        })

    }



})


function sendMail(recipient, subject, body) {
    console.log('sending to: ' + recipient)

    console.log('subject: ' + subject)

    console.log(body)
}

module.exports = router