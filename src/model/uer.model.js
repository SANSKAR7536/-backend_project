import { jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose,{Schema} from "mongoose";


 const UserSchema=Schema({
    id:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        max:50,
        min:12,
        trim:true,  // remove white spaces

    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,

    },
    fullName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true    // if a search query is applied then use this

    },
    avatar: {
        type:String,
        required:true,
       

    },
    coverImage:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    refreshToke:{
        type:String,

    },
    createdAt:{
        type:Date,
        required:true,

    },
    updatedAt:{
        type:Date,
        required:true,
    },
    watchHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
    }


 },{timestamps:true})
 UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();   // save  eacch time when only get updated not wen user changes any other thing
    this.password=await bcrypt.hash(this.password,10)
    next()

 })
  UserSchema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password)

  }
   UserSchema.methods.generateAceesToken=function (){
    return jwt.sign(
       {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET
        ,{
            expiresIn:ACCESS_TOKEN_EXPIRY
        }


    )
   }

   UserSchema.methods.generateRefreshToken=function (){
    return jwt.sign(
       {
            _id: this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET
        ,{
            expiresIn:REFRESH_TOKEN_EXPIRY
        }


    )
   }

 const User=mongoose.model("User",UserSchema);
