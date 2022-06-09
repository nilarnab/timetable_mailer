const express = require('express');
const { redirect } = require('express/lib/response');
const College = require("../models/colleges")
const Branch = require("../models/branches")
const Teacher = require("../models/teachers")
const Schedule = require("../models/schedule")
const Table = require("../models/tables")
const Year = require("../models/years")

middleware = require("../middlewares/auth.js")

const router = express.Router();

router.get('/home', middleware.auth, async (req, res, next) => {
    if (req.session.message) {
        var message = req.session.message
    }
    else {
        var message = null
    }

    // getting all the teachers
    var all_teachers = await Teacher.find({ 'college_id': req.session.college }).find({ 'branch_id': req.session.branch })
    // console.log(all_teachers[0]['_id'].toString())
    req.session.message = null

    var days_array = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    var per_ids_array = ['1', '2', '3', '4', '5', '6', '7', '8']

    // getting super admin data
    var branches = await Branch.find({})
    var colleges = await College.find({})
    var years = await Year.find({})

    console.log(req.session)


    return res.render("../views/admin.ejs", {
        message: message,
        days: days_array,
        per_ids: per_ids_array,
        teachers: all_teachers,
        user: req.session,
        branches: branches,
        colleges: colleges,
        years: years
    })

});


router.get('/make_table', middleware.auth, async (req, res, next) => {
    console.log(req.session);
    if (req.session.message) {
        var message = req.session.message
    }
    else {
        var message = null
    }

    // getting all the teachers
    var all_teachers = await Teacher.find({ 'college_id': req.session.college }).find({ 'branch_id': req.session.branch })
    // console.log(all_teachers[0]['_id'].toString())
    req.session.message = null

    // hardcoded
    var days_array = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    var per_ids_array = ['1', '2', '3', '4', '5', '6', '7', '8']

    // finding the data that already exists





    return res.render("../views/create_table.ejs", {
        message: message,
        days: days_array,
        per_ids: per_ids_array,
        teachers: all_teachers,
        user: req.session
    })
})

// post requests
router.post('/handle_add_college', middleware.auth_super, async (req, res, next) => {

    const college = new College(
        {
            name: req.body.name
        }
    )


    try {
        const new_college = await college.save()
        req.session.message = "Done"
    }

    catch
    {
        req.session.message = "Did not work";
    }

    res.redirect('/admin/home');


})


router.post('/handle_add_branch', middleware.auth_super, async (req, res, next) => {

    const branch = new Branch(
        {
            short_name: req.body.name
        }
    )


    try {
        const new_branch = await branch.save()
        req.session.message = "Done"
    }

    catch
    {
        req.session.message = "Did not work"
    }

    res.redirect('/admin/home');


})


// get course name, teacher given a per_id and day
router.post('/get_existing_data', async (req, res, next) => {

    var record = {}

    // console.log("got")
    // console.log(req.body)

    var existings = await Schedule.find({ table_name: req.body.name })

    // console.log(existings)

    existings.forEach((existing, index) => {
        record[existing.per_id + '_' + existing.day] = { 'name': existing.course_name, 'teacher': existing.teacher }

    })

    console.log(record)

    return res.json({ record: record })


})


router.post('/handle_add_teacher', async (req, res, next) => {

    const teacher = new Teacher(
        {
            name: req.body.name,
            college_id: req.session.college,
            branch_id: req.session.branch
        }
    )

    try {
        const new_teacher = await teacher.save()
        req.session.message = "Done"
    }

    catch
    {
        req.session.message = "Did not work"
    }

    console.log('added a new teacher')
    console.log("now session")
    console.log(req.session)
    console.log('/')

    res.redirect('/admin/home');


})


router.post('/handle_new_schedule', middleware.auth_prvl_1, async (req, res, next) => {


    // check if the table is already made
    var existing_table = await Table.find({ name: req.body.table_name })

    console.log("existing table")
    console.log(existing_table)

    if (existing_table.length == 0) {
        // make a new table
        var new_table = new Table(
            {
                name: req.body.table_name,
                branch_id: req.session.branch,
                college_id: req.session.college,
                year_id: req.session.year
            }
        )

        await new_table.save()
    }


    // first have to find if such an entry already exists

    var old_entry = await Schedule.find(
        {
            table_name: req.body.table_name,
            day: req.body.day,
            per_id: req.body.per_id
        }
    )

    console.log(old_entry)

    if (old_entry.length > 0) {

        console.log('updating entry')

        var update_entry = await Schedule.updateOne(
            {
                table_name: req.body.table_name,
                day: req.body.day,
                per_id: req.body.per_id
            },
            {
                course_name: req.body.course_name,
                teacher: req.body.teacher
            }
        )

        return res.json({ verdict: true })

    }

    else {
        // creates a new entry in shedukes collection
        var new_entry = new Schedule(
            {
                table_name: req.body.table_name,
                course_name: req.body.course_name,
                day: req.body.day,
                per_id: req.body.per_id,
                teacher: req.body.teacher
            }
        )

        const new_entry_ret = await new_entry.save()

        try {


            return res.json({ verdict: true })
        }

        catch
        {
            return res.json({ verdict: false, message: "Did not work" })
        }

    }




})



module.exports = router