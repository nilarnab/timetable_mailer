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
const MailQueue = require("../models/mailqueue")
const session = require('express-session');
const BatchTableRel = require('../models/BatchTableRel');
middleware = require("../middlewares/auth.js")

const router = express.Router();
function pp() {
    console.log("jai ho");
}
router.get("/mywork", async (req, res, next) => {
    // console.log(await Users.find({ email: "vishnumali3911@gmail.com" }));
    // console.log(await College.find({}));
    // console.log(await Branch.find({}));
    console.log(await Year.find({}));
    // if (1) {
    //     pp();
    // }
    if ((await Users.updateOne({ email: "vishnumali3911@gmail.com" },
        { $set: { super: 0 } }))) {
        console.log("updated");
        console.log(await Users.find({ email: "vishnumali3911@gmail.com" }));
    }
    // const newRelation=new Relation({
    //     branch_id: '62a0b95ed86d79902c0c661d',
    //     college_id: '62a0b81a1581908370fd3ec8',
    //     year_id: '62a0efdf5f57a39d74c6dfbc'
    //     name :
    // })
    res.send("done");
})
router.get('/home', middleware.auth, async (req, res, next) => {
    if (req.session.message) {
        var message = req.session.message
    }
    else {
        var message = null
    }

    // getting all the teachers
    var all_teachers = await Teacher.find({ 'college_id': req.session.college }).find({ 'branch_id': req.session.branch })
    // console.log(all_teachers[0]['_id'].toString())
    req.session.message = null

    var days_array = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    var per_ids_array = ['1', '2', '3', '4', '5', '6', '7', '8']

    // getting super admin data
    var branches = await Branch.find({})
    var colleges = await College.find({})
    var years = await Year.find({})

    console.log(req.session)

    



    // finding all the tables of the batch
    var all_tables = await Table.find({'branch_id': req.session.branch, 'college_id': req.session.college, 'year_id': req.session.year})

    var linked_table = await BatchTableRel.find(
        {
            branch_id: req.session.branch,
            year_id: req.session.year,
            college_id: req.session.college
        }
    )

    console.log("linked table found as")
    console.log(linked_table)

    var linked_table_serve = "NONE"
    if (linked_table.length > 0)
    {
        linked_table_serve = linked_table[0]["name"]
    }

    return res.render("../views/admin.ejs", {
        message: message,
        days: days_array,
        per_ids: per_ids_array,
        teachers: all_teachers,
        user: req.session,
        branches: branches,
        colleges: colleges,
        years: years,
        all_tables: all_tables,
        table_name: linked_table_serve
    })

});


router.get('/make_table', middleware.auth, async (req, res, next) => {
    console.log(req.session);
    if (req.session.message) {
        var message = req.session.message
    }
    else {
        var message = null
    }

    // getting all the teachers
    var all_teachers = await Teacher.find({ 'college_id': req.session.college }).find({ 'branch_id': req.session.branch })
    // console.log(all_teachers[0]['_id'].toString())
    req.session.message = null

    // hardcoded
    var days_array = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    var per_ids_array = ['1', '2', '3', '4', '5', '6', '7', '8']

    
    // finding the data that already exists

    return res.render("../views/create_table.ejs", {
        message: message,
        days: days_array,
        per_ids: per_ids_array,
        teachers: all_teachers,
        user: req.session,
    })
})

// post requests
router.post('/handle_add_college', middleware.auth_super, async (req, res, next) => {
    console.log("Trying to add new college");
    console.log(req.body.name);
    const college = new College(
        {
            name: req.body.name
        }
    )
    if ((await College.find(college)).length == 0) {
        try {
            const new_college = await college.save()
            req.session.message = "Done"
        }

        catch {
            // req.session.message = "Did not work";
        }
    }
    else {
        req.session.message = "A college with same name already present."
    }
    res.redirect('/admin/home');



})


router.post('/handle_add_branch', middleware.auth_super, async (req, res, next) => {

    const branch = new Branch(
        {
            short_name: req.body.name
        }
    )

    if ((await Branch.find(branch)).length === 0) {
        try {
            const new_branch = await branch.save()
            req.session.message = "Done"
        }

        catch
        {
            // req.session.message = "Did not work"
        }
    }
    else {
        req.session.message = "Branch already added";
    }
    console.log(req.session.message);
    res.redirect('/admin/home');


})
router.post('/handle_add_year', middleware.auth_super, async (req, res, next) => {

    const year = new Year(
        {
            name: req.body.name
        }
    )
    console.log(year);
    if ((await Year.find(year)).length === 0) {
        try {
            const new_branch = await year.save()
            req.session.message = "Done"
        }

        catch
        {
            // req.session.message = "Did not work";
        }
    }
    else {
        req.session.message = "Year already added";
    }
    console.log(req.session.message);

    res.redirect('/admin/home');


})

router.post('/get_existing_data', async (req, res, next) => {


    // find if has access of the table
    var access = 1

    var old_table = await Relation.find({ name: req.body.name });
    console.log("rip", old_table);
    if (req.session.super == 0) {
        if (old_table.length > 0) {
            // table already exists
            // finding if it is the batch table
            if (req.session.branch == old_table[0].branch_id
                && req.session.college == old_table[0].college_id
                && req.session.year == old_table[0].year_id && req.session.role === 1) {

            }

            else {
                access = 0
            }

        }

    }

    console.log('current access ' + access)


    var record = {}

    // console.log("got")
    // console.log(req.body)

    if (access) {
        var existings = await Schedule.find({ table_name: req.body.name })

        // console.log(existings)



        existings.forEach((existing, index) => {
            record[existing.per_id + '_' + existing.day + '_' + existing.valid_batches] = { 'name': existing.course_name, 'teacher': existing.teacher, 'valid_batches': existing.valid_batches }

        })


    }

    console.log(record)

    return res.json({ record: record })


})


router.post('/handle_add_teacher', async (req, res, next) => {

    const teacher = new Teacher(
        {
            name: req.body.name,
            college_id: req.session.college,
            branch_id: req.session.branch
        }
    )

    try {
        const new_teacher = await teacher.save()
        req.session.message = "Done"
    }

    catch
    {
        req.session.message = "Did not work"
    }

    console.log('added a new teacher')
    console.log("now session")
    console.log(req.session)
    console.log('/')

    res.redirect('/admin/home');


})


router.post('/handle_link', async (req, res, next) => {

    /*
        First, have to find if a link already exists

        if not create one
        else
        just update it
    */

    console.log("handling a new link");
    console.log("got ");
    console.log(req.body.name)


    var old_link = await BatchTableRel.find(
        {
            branch_id: req.session.branch, 
            college_id: req.session.college, 
            year_id: req.session.year
        });

    console.log("old link found as ")
    console.log(old_link)
    console.log("session as")
    console.log(req.session)

    console.log("deleting old entry if any")
    BatchTableRel.deleteOne(
        {
            branch_id: req.session.branch, 
            college_id: req.session.college, 
            year_id: req.session.year
        }, function( err, result ) {
            if ( err ) throw err;
        }
    )

    console.log("making a new link");
        var new_link = new BatchTableRel(
            {
                name: req.body.name,
                branch_id: req.session.branch, 
                college_id: req.session.college, 
                year_id: req.session.year
            }
        )

    const new_link_ret = await new_link.save()

    console.log("work complete")

    req.session.message = "Done"

    res.redirect('/admin/home');


})


router.post('/handle_delete_entry', middleware.auth_prvl_1, async (req, res, next) => {
    // check if the table is already there

    console.log("deletion request got")
    console.log(req.body)

    Schedule.deleteOne(
        {
            table_name: req.body.table_name,
            per_id: req.body.per_id,
            day: req.body.day,
            valid_batches: req.body.batch_key

        }
        , function(err, obj) {
        if (err) throw err;
        console.log(" document(s) deleted");
      });

    console.log("deletion complete");

    return res.json({verdict: true})
    

})


router.post('/handle_new_table', middleware.auth_prvl_1, async (req, res, next) => {
    // check if the table is already there

    if ((await Table.find({ name: req.body.table_name })).length == 0) {
        // make a new table
        console.log('creating table with')
        console.log(req.body)
        var new_table = new Table(
            {
                name: req.body.table_name,
                branch_id: req.session.branch,
                college_id: req.session.college,
                year_id: req.session.year
            }
        )

        await new_table.save()
    }
    else
    {
        console.log("table already exists");
    }
})

router.post('/handle_new_schedule', middleware.auth_prvl_1, async (req, res, next) => {
    // fiding if access is there
    var access = 1
    var old_table = await Relation.find({ name: req.body.name })

    if (req.session.super == 0) {
        if (old_table.length > 0) {
            // table already exists

            // finding if it is the batch table
            console.log(req.session.branch, old_table[0].branch_id, req.session.college, old_table[0].college_id, req.session.year, old_table[0].year_id);
            if (req.session.branch, old_table[0].branch_id
                && req.session.college == old_table[0].college_id
                && req.session.year == old_table[0].year_id && req.session.role === 1) {

            }

            else {
                access = 0
            }

        }

    }

    console.log("access at insertion " + access)

    if (access == 0) {
        return res.json({ verdict: false, message: 'forbiddeen' })
    }


    


    // first have to find if such an entry already exists

    var old_entry = await Schedule.find(
        {
            table_name: req.body.table_name,
            day: req.body.day,
            per_id: req.body.per_id,
            valid_batches: req.body.batch_key
        }
    )
    
    console.log("old entry")
    console.log(old_entry)
    console.log("request")
    console.log(req.body)

    if (old_entry.length > 0) {

        console.log('updating entry');

        if (old_entry[0].course_name == req.body.course_name && old_entry[0].teacher == req.body.teacher)
        {
            console.log("no changes required")
            return res.json({verdict: true})
        }

        var update_entry = await Schedule.updateOne(
            {
                table_name: req.body.table_name,
                day: req.body.day,
                per_id: req.body.per_id,
                valid_batches: req.body.batch_key
            },
            {
                course_name: req.body.course_name,
                teacher: req.body.teacher,
            }, function (err, obj)
            {
                console.log("updation complete")
            }
        ).clone()

        return res.json({ verdict: true })

    }

    else {
        // creates a new entry in shedukes collection
        var new_entry = new Schedule(
            {
                table_name: req.body.table_name,
                course_name: req.body.course_name,
                day: req.body.day,
                per_id: req.body.per_id,
                teacher: req.body.teacher,
                valid_batches: req.body.batch_key
            
            }
        )



        // try {

        const new_entry_ret = await new_entry.save()
        return res.json({ verdict: true })

        // }
        // catch
        // {
        //     return res.json({ verdict: false, message: "Did not work" })
        // }

    }




})



// handling custom mails
router.get("/send_custom_mails", middleware.auth_prvl_1, async (req, res, next) => 
{

    // getting super admin data
    var branches = await Branch.find({})
    var colleges = await College.find({})
    var years = await Year.find({})
    var message = req.session.message

    return res.render("../views/customMail.ejs", {
        branches: branches,
        colleges: colleges,
        years: years,
        message: message
    })
})

router.post("/handle_custom_mail", middleware.auth_prvl_1, async (req, res, next) => {

    
    var query = {}

    if (req.body.branch != 'all')
    {
        query["branch"] = req.body.branch
    }

    if (req.body.year != 'all')
    {
        query["year"] = req.body.year
    }

    if (req.body.college != 'all')
    {
        query["college"] = req.body.college
    }

    console.log("query")
    console.log(query)

    var all_sendables = await Users.find(query);

    var new_task = new MailQueue(
        {
            body: req.body.body,
            branch: req.body.branch,
            year: req.body.year,
            college: req.body.college,
            predicted_affected: all_sendables.length
        }
    )

    var task_submited = await new_task.save()
    
    req.session.message = "Done"
    
    res.redirect('/admin/home');

})




// router.post('/handle_add_college', middleware.auth_super, async (req, res, next) => {
//     const college = new College(
//         {
//             name: req.body.name
//         }
//     )
//     try {
//         const new_college = await college.save()
//         req.session.message = "Done"
//     }
//     catch
//     {
//         req.session.message = "Did not work"
//     }
//     res.redirect('/admin/home');
// })



module.exports = router