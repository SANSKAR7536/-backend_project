import mongoose,{Schema} from "mongoose"

const PlaylistSchema=Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        max:50,
        min:5,

    },
    description:{
        type:String,
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
        ref:'Videos'
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"Owner",
        
    }

},{timestamps:true})

export const Playlist=new mongoose.model("Playlist",PlaylistSchema)