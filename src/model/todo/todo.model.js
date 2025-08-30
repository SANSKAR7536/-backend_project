// import mongoose from "mongoose";
// const todoschema =new mongoose.Schema({
//     content:{
//         type:String,
//         required:true,
//         lowercase:true,

//     },
//     complete:{
//         type:Boolean,
//         default:false,

//     },
//     createdBy:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"user"
//     },
//     subtodos:[
//         {
//             createdBy:{
//                 type:mongoose.Schema.Types.ObjectId,
//                 ref:
//                 "subtodo"
//             }
//         }
//     ]

// },{timestamps:true})
// export const todo=mongoose.model("todo",todoschema)

import mongoose, { mongo } from "mongoose";
const todoschema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        max: [120, "you have reached the maxx limit"],
        lowercase: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",

    },
    subtodo: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subtodo"
        }

    }


}, { timestamps: true })
