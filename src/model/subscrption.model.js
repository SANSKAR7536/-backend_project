import mongoose,{ Schema }from "mongoose";

const   SubscrptionSchema= Schema({

    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    channel:{
         type:Schema.Types.ObjectId,
        ref:"User",

    }
},{timestamps:true})


export const Subscrption=new  mongoose.model("Subscrption",SubscrptionSchema)