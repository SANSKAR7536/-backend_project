// const mongoose = require('mongoose');

// const userschema= new mongoose.Schema({
//    username:{
//     type:String,
//     required:true,
//     unique:true,
//     min:[12,"the username is too short "],
//     lowercase:true,
//    },
//    email:{
//     type:String,
//     required:true,
//     lowercase:true,

//    },
//    password:{
//     type:String,
//     required:[true,"enter your password"]

//    }

// },{timestamps:true})
//  export const User =mongoose.model("user",userschema)


 import mongoose from "mongoose";
 const userschema=mongoose.Schema({
   username:{
      type:String,
      required:[true,"enter the  username first "],
      unique:true,
      min:8,
      lowercase:true
   },
   password:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
   }
 },{ timestamps:true})

 const user=mongoose.model("user",userschema)