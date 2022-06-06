
const session = require('express-session');
const { redirect } = require('express/lib/response');


module.exports = {
    auth: function (req, res, next)
    {
        /*
            Check the validiy of auth (login)
            if logged in, then allows to pass
            or redirects
            
        */
        console.log("Auth checking middleware");
        if (req.session.email)
        {
            console.log("Allowed entry");
            next();
        }

        else
        {
            console.log("Denied");
            return res.redirect('/')
        }
       
    }
}