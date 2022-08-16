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
require('dotenv').config()
const Schedule = require("../models/schedule")
const Relation = require("../models/BatchTableRel")
const Teacher = require("../models/teachers")
const AccessToken = require("../models/accesstokens")
middleware = require("../middlewares/auth.js")
var nodemailer = require('nodemailer');
const {
    count
} = require('../models/colleges');
const BatchTableRel = require('../models/BatchTableRel');

let transporter = nodemailer.createTransport({
    service: "Yahoo",
    secure: true,
    auth: {
        user: process.env.MAILING_EMAIL,
        pass: process.env.MAILING_PASSWORD,
    },
});
//sending mail
function SEND_MAIL(destination, subject, per_id_scheds, token) {

    var body = ''


    body += '<p>Greetings from mailerBot</p>'

    body += '<p>Your Schedule today:</p>'

    body += '<table style="width:60%;">'

    body += '<tr style="color: aliceblue; border: 1px solid grey; background-color: rgb(39, 39, 39); padding: 20px">'
    body += '<td style="border: 1px solid grey; padding: 20px">Period</td>'
    body += '<td style="border: 1px solid grey; padding: 20px">Course</td>'
    body += '<td style="border: 1px solid grey; padding: 20px">Professor</td>'
    body += '</tr>'

    // hardcoded
    var pers = ['1', '2', '3', '4', '5', '6', '7', '8']

    // forming the body
    pers.forEach((per_id, index) => {
        if (per_id in per_id_scheds) {
            body += '<tr style="color: grey; border: 1px solid grey;">'
            body += '<td style="border: 1px solid grey; padding: 5px">' + per_id + '</td>'
            body += '<td style="border: 1px solid grey; padding: 5px">' + per_id_scheds[per_id].course_name + '</td>'
            body += '<td style="border: 1px solid grey; padding: 5px">' + per_id_scheds[per_id].teacher_name + '</td>'
            body += '</tr>'
        } else {
            body += '<tr style="color: green; border: 1px solid grey;">'
            body += '<td style="border: 1px solid grey; padding: 5px">' + per_id + '</td>'
            body += '<td style="border: 1px solid grey; padding: 5px">Free</td>'
            body += '<td style="border: 1px solid grey; padding: 5px">Free</td>'
            body += '</tr>'
        }

    })

    body += '</table>'

    body += '<p>Thanks</p>'
    body += '<p>mailerBot</p>'

    body += '<br>'
    body += '<p>PS: This project is running as BETA and might not reflect sudden changes in schedule (Like professor deciding to take 2 extra classes simply because the day is beautiful) or any holiday (as of now!). However, if you want any upgrades, feel free to mail at</p>'
    body += "<p>nilarnabdebnath@gmail.com</p>"
    body += "<p>2020ucp1018@mnit.ac.in</p>"
    body += "<p>(be nice in the mail, and you might even get a reply !!)</p>"

    body += "<p>Jokes apart, we really appreciate any input</p>"

    body += "<p>Also, if you want to, you may <a href="+ process.env.BASE_URL +"/verify/act_by_link?email=" + destination +"&token=" + token + "&action=LOGIN>Login</a></p>"
    body += "<p>Also, if you want to, you may <a href="+ process.env.BASE_URL +"/verify/act_by_link?email=" + destination +"&token=" + token + "&action=SEMI_UNSUSCRIBE>I dont need the schedules, but I would like the study materials that are often sent</a></p>"
    body += "<p>Also, if you want to, you may <a href="+ process.env.BASE_URL +"/verify/act_by_link?email=" + destination +"&token=" + token + "&action=UNSUSCRIBE>I guess it is time to say goodbye. I want to unsuscribe</a></p>"
    body += "<p>Also, if you want to, you may <a href="+ process.env.BASE_URL +"/verify/act_by_link?email=" + destination +"&token=" + token + "&action=ENABLE>I had by mistake unsuscribed, I want to suscribe</a></p>"



    console.log('sending to ', destination)
    console.log(body)


    // return 

    // preparing to send the mail


    console.log("sending mail");
    console.log(subject, body);
    var mailOptions = {
        from: process.env.MAILING_EMAIL,
        to: destination,
        subject: subject,
        html: body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


router.get('/start_engine', async (req, res, next) => {
    // getting week day
    const weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    const d = new Date();
    console.log(d);
    let day = weekday[d.getDay()];


    console.log('day found as ' + day)


    // validation for request
    engineKey = req.query.engineKey;

    if ((await Resource.find({
            engineKey: engineKey
        })).length === 0) {
        return res.status(403).send('Forbidden')
    } else {

        // gained access
        console.log('Engine Key OK')
        console.log('Preparing to start the engine, gathering all users')


        // gathering all the users

        var users = await Users.find({});

        console.log('all users');
        console.log(users);

        // for each user
        users.forEach(async (user, index) => {
            console.log('Trying to mail ' + user.email);

            if (user.enabled == 1) {
                console.log("user enabled")
                var all_tables = await Table.find({})
                console.log("all tables", all_tables);
                console.log(user)
                if ((await BatchTableRel.find({
                        batch_id: user.batch,
                        college_id: user.college,
                        year_id: user.year
                    })).length == 0) {
                    console.log("No linked table found for " + user.email)
                } else {
                    var table_name = (await BatchTableRel.find({
                        batch_id: user.batch,
                        college_id: user.college,
                        year_id: user.year
                    }))[0].name
                    console.log("Linked table name found as " + table_name);
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
                            // var body = '<h4>Hi</h4><p>Your schedule today</p>'

                            console.log('in busy loading')
                            var count_array = [];
                            var per_id_scheds = {};

                            schedule.forEach(async (entry, index) => {
                                var teacher_entry = await Teacher.findById(entry.teacher);
                                // body += '<p>at period: ' + entry.per_id + ' you have ' + entry.course_name + ' by ' + teacher_entry.name + '</p>'

                                per_id_scheds[entry.per_id] = {
                                    course_name: entry.course_name,
                                    teacher_name: teacher_entry.name
                                }

                                count_array.push(await Teacher.findById(entry.teacher));
                                if (count_array.length === schedule.length) {
                                    
                                    SEND_MAIL(user.email, subject, per_id_scheds, user.token);
                                    console.log("complete for user", user.email)
                                }

                                try {

                                } catch (error) {
                                    console.log("Error in setting up data for mail to ", user.email);
                                }
                            });
                        }


                    })







                }

            }



        })

    }


    return res.status(200).send("Complete")

})


function sendMail(recipient, subject, body) {
    console.log('sending to: ' + recipient)

    console.log('subject: ' + subject)

    console.log(body)
}

module.exports = router