import mongoose,{Schema} from "mongoose";

const Likes=Schema({
    comment:{
        type:mongoose.Types.ObjectId,
        ref:"Comments",

    },
    createdAt:{
        type:Date,

    },
    updatedAt:{
        type:Date,
    },
    video:{
        type:mongoose.Types.ObjectId,
        ref:"Video"

    },
    likedBy:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },
    tweet:{
        type:mongoose.Types.ObjectId,
        ref:"Tweet"
    }
},{timestamps:true})