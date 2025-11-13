const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


mongoose.connect('mongodb://127.0.0.1:27017/hospitaldb',{useNewUrlParser : true});


const schema = new mongoose.Schema({
    pid : String,
    pname : String,
    phone : Number,
    gender : String,
    bgroup : String
},{collection:'hospital'});

const hos = mongoose.model('hos',schema);
app.get('/',function(req,res){
    res.render('home');
});
app.get('/signup',function(req,res){
    res.render('signup');
});
app.get('/login',function(req,res){
    res.render('login');
});
app.get("/operations",function(req,res){
    res.render('operations');
});
app.get("/update",function(req,res){
    res.render('update');
});
app.get("/compare",function(req,res){
    res.render('compare');
});

app.get('/delete',function(req,res){
    res.render("delete");
});
app.get('/updateform/:pid',function(req,res){
    const pid = req.params.pid;
    res.render('updateform',{pid : pid});                    
})
app.post('/signup',async function(req,res){
    const pid = req.body.pid;
    const pname = req.body.pname;
    const phone = req.body.phone;
    const gender= req.body.gender;
    const bgroup = req.body.bgroup;

    try{
        const newpatient = new hos({
            pid : pid,
            pname : pname,
            phone : phone,
            gender: gender,
            bgroup : bgroup
        });

        const result = await newpatient.save();
        console.log("Inserted successfully ✅");
        res.send("<script>alert('Inserted successfully ✅');</script>");
    }
    catch(err)
    {
        console.log(err);
        res.send("Error Bro 😭❌🤷‍♂️");
    }
})
app.post('/login',async function(req,res){
    const pid = req.body.pid;

    try{
        const result = await hos.find({pid : pid});
        console.log(result);
        if(result.length > 0)
        {
            res.redirect("/operations");
        }
        else
        {
            res.send("No user exist , Please create the account");s
        }
    }
    catch(err)
    {
        console.log(err);
        res.send("Error occured in login");
    }
});

app.post('/update', async function(req,res){
    const pid = req.body.pid;
    const upfield = req.body.upfield;
    const upvalue = req.body.upvalue;
    try{
        const result = await hos.updateOne({pid:pid},{$set:{[upfield]:upvalue}});
        res.send("updated sccussfull✅");
    }
    catch(err){
        console.log(err);
        res.send("error occured in update ❌");
    }
});
app.post('/updateform', async function(req,res){
    const pid = req.body.pid;
    const upfield = req.body.upfield;
    const upvalue = req.body.upvalue;
    try{
        const result = await hos.updateOne({pid:pid},{$set:{[upfield]:upvalue}});
        res.send("updated sccussfull✅");
    }
    catch(err){
        console.log(err);
        res.send("error occured in update ❌");
    }
});
app.get('/find',async function(req,res){
    try{
        const result = await hos.find({});
        console.log(result);
        res.render('findres',{patients:result});
    }
    catch(err)
    {
        console.log(err);
        res.send("Error Occured in find");
    }
});
app.post('/compare',async function(req,res){
    const pid1 = req.body.pid1;
    const pid2 = req.body.pid2;
    try{
        const result = await hos.find({pid:{$in:[pid1,pid2]}});
        res.render('findres',{patients:result});
    }
    catch(err)
    {
        console.log(err);
        res.send("Error occured in compare");
    }
})
app.post('/delete',async function(req,res){
    const pid = req.body.pid;
    try{
        const result = await hos.deleteOne({pid:pid});
        res.send("Delete successfully");
    }
    catch(err)
    {
        console.log(err);
        res.send("Error occured in delete");
    }
});
app.get('/updaterow',async function(req,res){
    try{
        const result = await hos.find({});
        console.log(result);
        res.render('updaterowdis',{patients:result});
    }
    catch(err)
    {
        console.log(err);
        res.send("Error Occured in find");
    }
});

app.listen(5000,function(req,res){
    console.log("http://localhost:5000");
});