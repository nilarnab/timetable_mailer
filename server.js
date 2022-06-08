const express = require('express');
const res = require('express/lib/response');
const session = require('express-session');
require('dotenv').config()
const app = express()
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: "Yahoo",
    secure: true,
    auth: {
        user: "mailerbot20@yahoo.com",
        pass: "efrnoxzntfobvbfa",
    },
});


//sending mail
const sendOtp = (email) => {
    console.log("sending mail");
    const otp = 100000 + Math.floor(Math.random() * 899999);
    var mailOptions = {
        from: 'mailerbot20@yahoo.com',
        to: `${email}`,
        subject: 'Register with us',
        html: `<div>
                <h1 style="text-align:center">Hello<h1/>
                <h2 style="color:green">OTP to Register : ${otp}<h2/>
            <div/>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
// sendOtp(email);
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

app.use('/admin', adminRouters);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(3000)