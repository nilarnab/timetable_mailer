const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const AccessToken = require("../models/accesstokens");

router.get('/verify_mail', async (req, res, next) => {
    const email = req.query.email;
    const access_token = req.query.token;
    console.log(email, access_token);
    console.log(await AccessToken.find({ email: email }));
    if ((await AccessToken.find({ email: email, access_token: access_token })).length === 1) {
        console.log(await AccessToken.deleteOne({ email: email, access_token: access_token }));
        const updated_user = await Users.updateOne(
            { email: email },
            { $set: { mail_verified: 1 } });
        
        curr_user = await Users.findOne({email: email})
        res.send("<p>Dude !!!! Registration successfull.</p> <p>Now, you will receive daily mails with your schedule with occasional college, placement, internship related materials </p> <p>To change your details, you can login now. </p> <p> Password is " + "<strong>" + curr_user["password"] + "</strong></p>");
    }
    else {
        res.send("<h1>Page Not for you . Lmao </h1>"); 
    }
});

router.get("/act_by_link", async (req, res, next) => {

    if (req.body.email != "" && req.body.token != "" && req.body.action != "")
    {

        // token check
        userEntry = await Users.find({email: req.body.email, token: req.body.token})
        
        if (userEntry.length == 1)
        {

            if (req.body.action == "LOGIN")
            {
                var data = (await Users.find({ 'email': req.body.email }))[0];

                req.session.email = data.email;
                req.session.branch = data.branch;
                req.session.college = data.college;
                req.session.year = data.year;
                req.session.role = data.role;
                req.session.super = data.super;
                req.session.mailVerified = data.mail_verified
                req.session.enabled = data.enabled

                res.redirect("/user/home")

            }
            else if (req.body.action == "UNSUSCRIBE")
            {

                // make enabled 0
                var entryUpdate = await Users.updateOne({email: req.body.email}, {enabled: 0});

            }
            else if (req.body.action == "SEMI_UNSUSCRIBE")
            {
                var entryUpdate = await Users.updateOne({email: req.body.email}, {enabled: 2})
            }
            
            else if (req.body.action == "ENABLE")
            {
                var entryUpdate = await Users.updateOne({email: req.body.email}, {enabled: 1})
            }


        }
        else
        {
            return res.send("Denied, no such username or token")
        }


        
    }
    else
    {
        return res.send("denied, not all field")
    }



})
module.exports = router