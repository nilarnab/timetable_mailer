const express = require('express');
const { redirect } = require('express/lib/response');
const College = require("../models/colleges")
const Branch = require("../models/branches")
const Teacher = require("../models/teachers")

const router = express.Router();

router.get('/home', (req, res, next) => 
{
    if (req.session.message)
    {
        var message = req.session.message
    }
    else
    {
        var message = null
    }

    req.session.message = null
    
    return res.render("../views/admin.ejs", {message: message})

});


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