const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const Users = require('../models/users');
const College = require('../models/colleges')
const Teacher = require('../models/teachers')

const Branch = require("../models/branches")
const Year = require("../models/years")
middleware = require("../middlewares/auth.js")

// Get requests
router.get('/home', middleware.auth, async (req, res, next) => {

    // res.send(get_college(req.session.College));

    var val = await Teacher.find({ college_id: req.session.college }).find({ branch_id: req.session.branch })
    console.log("moving ahead")

    var branch = ''
    var college = ''
    var year = ''



    var branch_row = await Branch.findById(req.session.branch)
    branch = branch_row.short_name

    var college_row = await College.findById(req.session.college)
    college = college_row.name

    var year_row = await Year.findById(req.session.year)
    console.log("year entry")
    console.log(req.session)
    year = year_row.name

    var branch_row = await Branch.findById(req.session.branch)
    branch = branch_row.short_name

    // getting all available data
    var branches = await Branch.find({})
    var colleges = await College.find({})
    var years = await Year.find({})


    res.render("../views/home.ejs", {
        session: req.session,
        teachers: val,
        user_info:
            { college: college, year: year, branch: branch },
        branches: branches,
        colleges: colleges,
        years: years

    })

})


async function get_teachers(college_id, branch_id) {


}


// helping functions
async function get_college(id) {

    var res = await College.findOne({});
    console.log('from get function')
    console.log(res)
    return res.short_name

}


async function get_branch(branch_id) {
    console.log('got ' + branch_id)




    return ''

}


module.exports = router