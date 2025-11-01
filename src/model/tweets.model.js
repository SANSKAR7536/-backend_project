 import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

 TweetSchema.plugin(require,mongooseAggregatePaginate)

 export const Tweets=new mongoose.model("Tweet",TweetSchema);

  