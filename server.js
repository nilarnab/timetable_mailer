const express = require('express');
const res = require('express/lib/response');
const session = require('express-session');
require('dotenv').config()
const app = express()

var nodemailer = require('nodemailer');


//sending mail
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


let transporter = nodemailer.createTransport({
    service: "Yahoo",
    secure: true,
    auth: {
        user: process.env.MAILING_EMAIL,
        pass: process.env.MAILING_PASSWORD,
    },
});




// sendOtp(email);        <== to send mail 




// settting up the database
const mongo = require('mongoose');
mongo.connect(process.env.DATABASE_URL, { usenewUrlParser: true })
const db = mongo.connection

db.on('error', (error) => { console.error(error) })
db.once('open', () => { console.log("connection complete") })

app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true,
    cookie: {
        expires: 6000000
    }
}));

app.use(express.urlencoded(
    {
        extended: true
    }))

app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {

    res.send("Pre login");

})
app.get('/test', (req, res, next) => {
    var my_obj = { email: "something@gmail.com", password: "plain data" }

    db.collection('users').insertOne(my_obj, (err, res) => {
        if (err) throw err
        console.log("insertion comoplete");
    })
})

app.get('/set_session', (req, res, next) => {
    req.session.email = 'nilu@gmail.com'
    req.session.branch = '629cfec544c0edf8422d27f41';
    req.session.college = '629de5bc0e3ba1001c7c72831';
    req.session.role = 1;
    req.session.super = 1;
    res.send('session set')

})



const adminRouters = require('./routes/admin.js');
const authRouter = require('./routes/auth.js');
const userRouter = require('./routes/user.js');
const engineRouter = require('./routes/cronEngine.js');
const verifyRouter = require('./routes/verify.js');
const monitorRouter = require('./routes/monitoring.js');

app.use('/admin', adminRouters);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/cronEngine', engineRouter)
app.use('/verify', verifyRouter);
app.use('/monitor', monitorRouter);

module.exports = { SEND_MAIL };
app.listen(process.env.PORT || 3000)