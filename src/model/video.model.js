
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

 const VideoSchema= Schema({
    videoFile:{
        type:String,   // by claudinary 
        required:true,
        
    },
    thumbnail:{       
        type:String,
        required:true,

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    title:{
        type:String,
        required:[true,"TITLE IS REQUIRED"],
        trim:true,
        lowercase:true,
        min:12,
        max:100,

    },
    description:{
        type:String,
        trim:true,
        lowercase:true,
        max:120,

    },
    duration:{
        type:Number,  //  DURATION IS GIVE BY CLAUDINARY NOT BY US 

    },
    views:{
        type:Number,
        default:0

    },
    isPublished:{
        type:Boolean,
        default:true

    },
    createdAt:{
        type:Date,
    },
    updatedAt:{
        type:Date,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }



 },{timestamps:true})
 VideoSchema.plugin(mongooseAggregatePaginate)

 export const Video=mongoose.model("Video",VideoSchema)
