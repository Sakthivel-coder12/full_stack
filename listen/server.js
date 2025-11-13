const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


mongoose.connect('mongodb://127.0.0.1:27017/studentdb',{useNewUrlParser:true});


const constschema = new mongoose.Schema({
    fname : String,
    lname : String,
    gender : String,
    phone : String
},{collection:"student"});

const stu = mongoose.model("stu",constschema);


app.get('/',function(req,res){
    res.render('home');
});
app.get('/insert',function(req,res){
    res.render('login');
});
app.get('/find',function(req,res){
    res.render('find');
});
app.get('/update',function(req,res){
    res.render('update');
});
app.get('/compare',function(req,res){
    res.render('compare');
});

app.post('/find',async function(req,res){
    try{
        const result = await stu.find({});
        res.render('display',{students:result});
        console.log(result);
    }
    catch(err)
    {
        console.log(err);
        res.send("Error occured ❌")
    }
})
app.get('/find/:name',async function(req,res){
    const name = req.params.name;
    try{
        const result = await stu.deleteMany({fname:name});
        res.redirect('/find');
    }
    catch(err)
    {
        console.log(err);
        res.send("Error occured ❌")
    }
})
app.post('/update',async function(req,res){
    const fname = req.body.fname;
    const up = req.body.update;
    const upvalue = req.body.upvalue;

    try{
        const result = await stu.updateOne({fname:fname},{$set:{[up]:upvalue}});
        res.send("update Aidichu da punda ✅");
    }
    catch(err)
    {
        console.log(err);
        res.send("Error occured ❌")
    }
});
app.post('/insert',async function(req,res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const gender = req.body.gender;
    const phone = req.body.phone;
    const newstudent = new stu({
        fname: fname,
        lname : lname,
        gender : gender,
        phone : phone
    });

    try{
        console.log("student deials is ",req.body);
        const result = await newstudent.save();
        res.send("The recored is inserted✅");
    }
    catch(err){
        console.log(err);
        res.send('Error Occured');
    }
});
app.post('/compare',async function(req,res){
    const student1 = req.body.student1;
    const student2 = req.body.student2;
    try{
        const result = await stu.find({fname:{$in:[student1,student2]}});
        res.render('discom',{students:result});
    }
    catch(err)
    {
        console.log(err);
        res.send("errror in compare❌");
    }
});

app.listen(3000,function(req,res){
    console.log('http://localhost:3000');
});