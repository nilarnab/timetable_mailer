const express = require('express');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const router = express.Router();
const Users = require('../models/users');
const College = require("../models/colleges")
const Branch = require("../models/branches")
const Year = require("../models/years")
const AccessToken = require("../models/accesstokens")
middleware = require("../middlewares/auth.js")
require('dotenv').config();
// const mail = require('../server.js');
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: "Yahoo",
    secure: true,
    auth: {
        user: process.env.MAILING_EMAIL,
        pass: process.env.MAILING_PASSWORD,
    },
});
function SEND_MAIL(destination, subject, body) {
    console.log("sending mail");
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
    var pass_gen = req.body.email + (Math.floor(Math.random() * 1000000));
    const user = new Users({
        email: req.body.email,
        college: req.body.college,
        branch: req.body.branch,
        // necessary attributes
        role: 0,
        super: 0,
        password: pass_gen,
        mail_verified: 0
    })
    const token = new AccessToken({
        email: req.body.email,
        access_token: JSON.stringify(Math.floor(Math.random() * 100000000000000))
    })
    try {
        console.log(await AccessToken.find({}), "hehe");
        const new_token = await token.save();
        //send mail with access token
        let subject = "Verify Your Email";
        let url = "http://localhost:3000/verify_mail?email=";
        let verifying_link = url + req.body.email + "&token=" + token.access_token;
        let body = `<div>
        <h1 style="text-align:center">Hello<h1/>
        <h2 style="color:green">Click on the given link to verify your mail ${verifying_link}<h2/>
    <div/>`;
        SEND_MAIL(req.body.email, subject, body);
        console.log("done");
        return res.json({ verdict: true, status: "mail sent" })
    }
    catch (err) {
        return res.json({ verdict: false, message: 'Something went wrong' })
    }

    // try {
    //     const new_user = await user.save();

    //     return res.json({ verdict: true })
    // }
    // catch (err) {
    //     return res.json({ verdict: false, message: 'Something went wrong' })
    // }



})

router.post('/login_username_handle', async (req, res, next) => {

    // used it to delte an older entry :-)
    if ((await Users.deleteOne({ 'email': "2020ucp1018@mnit.ac.in" }))) {
        console.log("deleted");
    }
    if ((await Users.find({ 'email': req.body.email })).length === 1) {
        return res.json({ verdict: true });
    }
    else {
        console.log("user not exist");
        return res.json({ verdict: false, message: "no such email" });
    }

    // ** if length > 1: return false, message: Unexpected situation, contact admin

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
