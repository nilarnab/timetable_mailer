const express = require('express');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const router = express.Router();
const Users = require('../models/users');
const College = require("../models/colleges")
const Branch = require("../models/branches")
const Year = require("../models/years")

middleware = require("../middlewares/auth.js")


// get requests
router.get('/login', (req, res, next) => {

    res.render("../views/login.ejs");
})

router.get('/register', async (req, res, next) => {

    // get all the colleges
    var colleges = await College.find({})

    // get all the branches
    var branches = await Branch.find({})

    // get all the years
    var years = await Year.find({})

    res.render("../views/register.ejs", {
        message: req.session.message,
        colleges: colleges,
        branches: branches,
        years: years

    });
})




// post requests

router.post('/register_username_validation', (req, res, next) => {

    return res.json({ verdict: true })
})

router.post('/register_handle', async (req, res, next) => {
    console.log(req.body);


    var pass_gen = req.body.email + Math.random()

    const user = new Users({
        email: req.body.email,
        college: req.body.college,
        branch: req.body.branch,

        // necessary attributes
        role: 0,
        super: 0,
        password: pass_gen
    })

    try {
        const new_user = await user.save();

        return res.json({ verdict: true })
    }
    catch (err) {
        return res.json({ verdict: false, message: 'Something went wrong' })
    }



})

router.post('/login_username_handle', async (req, res, next) => {


    /*

        Finds of there is a username in the database


    */

    if ((await Users.find({ 'email': req.body.email })).length === 1) {
        return res.json({ verdict: true });
    }
    else {
        console.log("user not exist");
        return res.json({ verdict: false, message: "no such email" });
    }

    // ** if length > 1: return false, message: Unexpected situation, contact admin

    return res.json({ verdict: true })

})


router.post('/login_handle', async (req, res, next) => {
    console.log(await Users.find({ 'email': req.body.email }));
    if ((await Users.find({ 'email': req.body.email }))[0].password === req.body.password) {
        var data = (await Users.find({ 'email': req.body.email }))[0];
        req.session.email = data.email;
        req.session.branch = data.branch;
        req.session.college = data.college;
        req.session.role = data.role;
        req.session.super = data.super;
        return res.json({ verdict: true });

    }
    else {
        return res.json({ verdict: false, message: 'Wrong password' })
    }

})

module.exports = router
