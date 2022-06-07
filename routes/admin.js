const express = require('express');
const { redirect } = require('express/lib/response');
const College = require("../models/colleges")
const Branch = require("../models/branches")
const Teacher = require("../models/teachers")

middleware = require("../middlewares/auth.js")

const router = express.Router();

router.get('/home', async (req, res, next) => 
{
    if (req.session.message)
    {
        var message = req.session.message
    }
    else
    {
        var message = null
    }

    // getting all the teachers
    var all_teachers = await Teacher.find({'college_id': req.session.college}).find({'branch_id': req.session.branch})
    console.log(all_teachers[0]['_id'].toString())
    req.session.message = null

    var days_array = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    var per_ids_array = ['1', '2', '3', '4', '5', '6', '7', '8']
    
    return res.render("../views/admin.ejs", {message: message, days: days_array, per_ids: per_ids_array, teachers: all_teachers})

});


router.get('/make_table', middleware.auth, async(req, res, next) => 
{
    if (req.session.message)
    {
        var message = req.session.message
    }
    else
    {
        var message = null
    }
    
    // getting all the teachers
    var all_teachers = await Teacher.find({'college_id': req.session.college}).find({'branch_id': req.session.branch})
    console.log(all_teachers[0]['_id'].toString())
    req.session.message = null

    var days_array = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    var per_ids_array = ['1', '2', '3', '4', '5', '6', '7', '8']

    return res.render("../views/create_table.ejs", {message: message, days: days_array, per_ids: per_ids_array, teachers: all_teachers})
})

// post requests
router.post('/handle_add_college', async (req, res, next) => {

    const college = new College(
        {
            name: req.body.name
        }
    )
    

    try
    {
        const new_college = await college.save() 
        req.session.message = "Done"
    }

    catch
    {
        req.session.message = "Did not work"
    }

    res.redirect('/admin/home');


})


router.post('/handle_add_branch', async (req, res, next) => {

    const branch = new Branch(
        {
            short_name: req.body.name
        }
    )
    

    try
    {
        const new_branch = await branch.save() 
        req.session.message = "Done"
    }

    catch
    {
        req.session.message = "Did not work"
    }

    res.redirect('/admin/home');


})


router.post('/handle_add_teacher', async (req, res, next) => {

    const teacher = new Teacher(
        {
            name: req.body.name,
            college_id: req.session.college,
            branch_id: req.session.branch
        }
    )
    
    try
    {
        const new_teacher = await teacher.save() 
        req.session.message = "Done"
    }

    catch
    {
        req.session.message = "Did not work"
    }

    res.redirect('/admin/home');


})



module.exports = router