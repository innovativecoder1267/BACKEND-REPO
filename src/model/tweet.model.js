import mongoose, { Schema, Types } from "mongoose";

const TweetSchema=new Schema({

    owner:{
        Types:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    }
         

},{timestamps:true})


export const tweet=mongoose.model("tweet",tweetschema)