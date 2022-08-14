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
        res.send("Dude !!!! verification Successfull .You can login now, Password is " + "<strong>" + curr_user["password"] + "</strong>");
    }
    else {
        res.send("<h1>Page Not for you . Lmao </h1>"); 
    }
});
module.exports = router