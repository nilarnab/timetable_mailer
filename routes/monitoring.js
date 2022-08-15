const express = require('express');
const { redirect } = require('express/lib/response');
const College = require("../models/colleges")
const Branch = require("../models/branches")
const Teacher = require("../models/teachers")
const Schedule = require("../models/schedule")
const Table = require("../models/tables")
const Year = require("../models/years")
const Users = require('../models/users');
const Relation = require("../models/BatchTableRel");
const session = require('express-session');
const BatchTableRel = require('../models/BatchTableRel');
const Monitor = require('../models/metrics');

middleware = require("../middlewares/auth.js")

const router = express.Router();

router.get("/start_monitoring", async (req, res, next) => {

    console.log("Starting monitoring")

    timeStamp = Date.now();

    // registeration monitoring
    regCount = await (await Users.find({})).length
    regCountEntry = new Monitor(
        {
            name: "REG",
            count: regCount,
            timestamp: timeStamp
        }
    )
    regCountEntry.save();
    
    // conf registration
    activeRegCount = await (await Users.find({mail_verified: 1, enabled: 1})).length;
    activeRegEntry = new Monitor(
        {
            name: "REG_CONF",
            count: activeRegCount,
            timestamp: timeStamp
        }
    )
    activeRegEntry.save();

    console.log("monitoring results: regCount " + regCount + " activeRegCount: " + activeRegCount)

    return res.send("Complete")


})


module.exports = router