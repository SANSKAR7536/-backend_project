 import mongoose,{Schema} from "mongoose";

 const TweetSchema=  Schema({
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",

    },
    content:{
        type:String,
        required:[true,"tweet cannot be empty "],
        trim:true,
        lowercase:true,

    },
    createdAt:{
        type:Date,
    },
    updatedAt:{
        type:Date,
    }

 },{timestamps:true})

 export const Tweets=new mongoose.model("Tweet",TweetSchema);

  