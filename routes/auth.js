const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const Users = require('../models/users');


middleware = require("../middlewares/auth.js")


// get requests
router.get('/login', (req, res, next) => {

    res.render("../views/login.ejs");
})

router.get('/register', (req, res, next) => {
    
    res.render("../views/register.ejs", {message: req.session.message});
})




// post requests

router.post('/register_username_validation', (req, res, next) => 
{

    return res.json({verdict: true})
})

router.post('/register_handle', async (req, res, next) => 
{
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
    
    try
    {
        const new_user = await user.save();
        
        return res.json({verdict: true})
    }
    catch (err) {
        return res.json({verdict: false, message: 'Something went wrong'})
    }
    
    

})

router.post('/login_username_handle', async (req, res, next) => {


    /*

        Finds of there is a username in the database


    */


    var rows = await Users.find({'email': req.body.email})

    console.log(rows)

    // if lenght == 1: return res.json({verdict: true})
    // if length == 0: return false, message: no such email

    // if length > 1: return false, message: Unexpected situation, contact admin

    return res.json({verdict: true})

})


router.post('/login_handle', async (req, res, next) => {

    return res.json({verdict: true})

})

module.exports = router
