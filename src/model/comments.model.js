import mongoose, { mongo, Schema } from "mongoose";

const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video"
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const comment=mongoose.model("comment",commentSchema)