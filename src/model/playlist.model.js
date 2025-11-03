import mongoose,{Schema} from "mongoose"

const PlaylistSchema=Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        max:50,
        min:5,

    },
    description:{
        type:String,
        lowercase:true,
        trim:true,
        max:100
    },
    createdAt:{
        type:Date,
    },
    updatedAt:{
        type:Date,
    },
    video:{
        type:mongoose.Types.ObjectId,
        ref:'Video',
        
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
       
        
    }

},{timestamps:true})

export const Playlist=new mongoose.model("Playlist",PlaylistSchema)