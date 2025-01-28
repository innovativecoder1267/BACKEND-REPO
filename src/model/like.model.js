import mongoose, { Schema } from "mongoose";
import { comment } from "./comments.model";



const LikeSchema=new Schema({
    comment:{
        type:Schema.Types.Objectid,
        ref:"comment"
    },
   likedvideo:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    likedby:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    tweetliked:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const like=mongoose.model("like",LikeSchema)