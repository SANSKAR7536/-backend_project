import mongoose,{Schema} from "mongoose";

const CommentsSchema=Schema({
    content:{
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    createdAt:{
        type:Date,
    },
    updatedAt:{
        type:Date,
    },
    videos:{
        type:mongoose.Types.ObjectId,
        ref:"Video"
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Comments=new mongoose.model("Comment",CommentsSchema)