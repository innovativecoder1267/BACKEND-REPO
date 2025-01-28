import mongoose from "mongoose";

const videoSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        required:true
    },
    filename:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }

},{timestamps:true})
  
export  const video=mongoose.model("video",videoSchema)