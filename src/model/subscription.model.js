 import mongoose from "mongoose";
import User from "./user.model";

 const subscriptionSchema=new mongoose.Schema({

    subscriber:{
        type:String,
      type:mongoose.Schema.types.ObjectId,
        ref:"user"
    },
    channel:{
        type:String,
       type:mongoose.Schema.types.ObjectId,
        ref:"user"
    }
    
 })
 export const subscription=mongoose.model("subscription",subscriptionSchema)