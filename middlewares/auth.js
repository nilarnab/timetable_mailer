
const session = require('express-session');
const { redirect } = require('express/lib/response');


module.exports = {
    auth: function (req, res, next) {
        /*
            Check the validiy of auth (login)
            if logged in, then allows to pass
            or redirects
            
        */
        console.log("Auth checking middleware");
        if (req.session.email) {
            if (req.session.mailVerified == 1 && req.session.enabled == 1) {
                console.log("Allowed entry");
                next();

            }
            else {
                console.log(req.session)

                console.log("Denied");
                return res.redirect('/auth/login')
            }

        }

        else {
            console.log("Denied");
            return res.redirect('/auth/login')
        }

    },

    auth_prvl_1: function (req, res, next) {
        /*
            Check the validiy of auth (login)
            if logged in, then allows to pass
            or redirects
            
        */
        console.log("Auth_super checking middleware");

        var granted = 0
        if (req.session.email) {

            if (req.session.role) {
                if (req.session.role >= 1) {
                    console.log("Granted");
                    granted = 1
                }
            }

        }

        if (granted == 1) {
            next()
        }
        else {
            console.log("Denied");
            return res.redirect('/auth/login')
        }




    },

    auth_super: function (req, res, next) {
        /*
            Check the validiy of auth (login)
            if logged in, then allows to pass
            or redirects
            
        */
        console.log("Auth_super checking middleware");
        console.log(req.session);
        if (req.session.email) {

            if (req.session.super) {
                if (req.session.super == 1) {
                    console.log("Granted");
                    next()

                }
            }

        }
        else {
            console.log("Denied is wajah se");
            return res.redirect('/auth/login');
        }



    }
}