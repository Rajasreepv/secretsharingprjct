//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption")

const app = express();



mongoose.connect("mongodb://127.0.0.1:27017/usersDB", { useNewUrlParser: true });
console.log("Database connected successfully");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
    email:String,
    password:String

})

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password'] });

const User=new mongoose.model("User",userSchema)

app.get("/",function(req,res){
    res.render("home")
})
app.get("/register",function(req,res){
    res.render("register")
})
app.post("/register",function(req,res){
    const newUser=new User({
   email: req.body.username,
    password : req.body.password
})
newUser.save().then(()=>{
    res.render("secrets");
}).catch((err)=>{
    console.log(err);
})
})

app.get("/login",function(req,res){
    res.render("login")
})
app.post("/login",function(req,res){
    const username=req.body.username
    const password=req.body.password
    User.findOne({email:username}).then((founduser)=>{
    
            if(founduser.password===password){
              res.render("secrets")  
            }}).catch((err)=>
            {
              console.log("error")
            })
        
  
})
app.get("/secrets",function(req,res){
    res.render("secrets")
})

app.listen(8080,function(){
    console.log("server startd on 8080")
})