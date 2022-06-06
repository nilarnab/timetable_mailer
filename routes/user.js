const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const Users = require('../models/users');
const College = require('../models/colleges')
const Teacher = require('../models/teachers')


middleware = require("../middlewares/auth.js")

// Get requests
router.get('/home', middleware.auth, async (req, res, next) => {
    
    // res.send(get_college(req.session.College));
    
    var val = await Teacher.find({college_id: req.session.college}).find({branch_id: req.session.branch})
    console.log(val)

    res.render("../views/home.ejs", {session: req.session, teachers: val})

})


async function get_teachers(college_id, branch_id)
{

    
}   


// helping functions
async function get_college(id)
{
    
    var res = await College.findOne({});
    console.log('from get function')
    console.log(res)
    return res.short_name
    
}


module.exports = router