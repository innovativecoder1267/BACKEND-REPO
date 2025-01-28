import mongoose from "mongoose";
import { playlist } from "../model/playlist.model";
import { apierrorhandler } from "../utils/ApiError";
import { apiresponse } from "../utils/apiresponse"; // Correct path if needed
import asynhandler from "../utils/asynchandler";
import { video } from "../model/video.model";
import { cloudinary } from "../utils/cloudinary";

const createplaylist = asynhandler(async (req, res) => {
    const { name, description } = req.body;
    const { userid } = req.params;

    if (!name || !description) {
        throw apierrorhandler(400, "name and description not found");
    }
    if (!userid) {
        throw apierrorhandler(400, "user id not found");
    }

    const videopath = req.files?.[0]?.path;  // Corrected path access
    if (!videopath) {
        throw apierrorhandler(400, "Cant Access The Video");
    }

    const uploadvideo = await cloudinary.upload(videopath, "videouploaded");
    if (!uploadvideo) {
        throw apierrorhandler(400, "Cant Upload The Video");
    }

    const newplaylist = await playlist.create({
        owner: userid,
        description: description,
        name: name,
        video: uploadvideo.url
    });

    if (!newplaylist) {
        throw apierrorhandler(400, "Cant Make The New Playlist");
    }

    return res.status(200)
        .json(new apiresponse(200, "NEW PLAYLIST CREATED", newplaylist));
});
const getuserplaylist=asynhandler(async(req,res)=>{
    //todo- task is to get user playlist
    const{userid}=req.params
    if(!userid){
        throw apierrorhandler(400,"user id not found")
    }
    const CheckUser=await  playlist.findById(userid,"user")
    if(!CheckUser){
        throw apierrorhandler(400,"user not found")
    }
    const GetPlaylist= await playlist.aggregate([
        {
            $match:{
                owner:mongoose.Types.ObjectId(userid)//look for this user in database
            }
        },
        {
            $lookup:{
            from:"videos",//details of video come from videos
            localfield:"videos",//data we get from playlist
            foreignfield:"_id",
            as:"video-details"
            }
        },{
            $project: {                       // Include fields from both collections
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                "videoDetails.title": 1,     // Specific video fields
                "videoDetails.url": 1,
                "videoDetails.duration": 1
            }
        }
    ])
    if(!GetPlaylist){
        throw apierrorhandler(400,"Playlist Not Found");
    }
    return res.status(200)
    .json(new apiresponse(200,"Playlist Got Succesfully"));
})
const findplaylistbyid=asynhandler(async(req,res)=>{
    const {playlistid}=req.params
    if(!playlistid){
        throw apierrorhandler(400,"playlist id not found")
    }
    const findplaylist=await playlist.findById(playlistid)
    if(!findplaylist){
        throw apierrorhandler(400,"playlist not found")
    }
    return res.status(200)
    .json(new apiresponse(200,"Found The Playlist",playlistid))
})
const addvideotoplaylist = asynhandler(async (req, res) => {
    const { playlistid, videoid } = req.params;

    if (!playlistid || !videoid) {
        throw apierrorhandler(400, "The info required not found");
    }

    // Update the playlist by adding the video
    const addvideo = await playlist.findByIdAndUpdate(
        playlistid,  // Corrected: using playlistid directly
        {
            $set: {
                video: videoid  // Corrected: just set the video to the videoid
            }
        },
        { new: true } // This will return the updated playlist
    );

    if (!addvideo) {
        throw apierrorhandler(400, "Can't Find The Playlist");
    }

    return res.status(200)
        .json(new apiresponse(200, "Video added successfully", addvideo));
});
const removevideofromplaylist = asynhandler(async (req, res) => {
    const { playlistid, videoid } = req.params;

    if (!playlistid || !videoid) {
        throw apierrorhandler(400, "Playlist or video not found");
    }

    // Check if the playlist contains the video
    const playlistToUpdate = await playlist.findById(playlistid);
    if (!playlistToUpdate) {
        throw apierrorhandler(400, "Playlist not found");
    }

    if (!playlistToUpdate.videos.includes(videoid)) {
        throw apierrorhandler(400, "Video not found in playlist");
    }

    // Update the playlist by removing the video
    const updatedPlaylist = await playlist.findByIdAndUpdate(
        playlistid,
        {
            $pull: { videos: videoid }  // Corrected: Use the $pull operator to remove the video
        },
        { new: true }  // Return the updated playlist
    );

    if (!updatedPlaylist) {
        throw apierrorhandler(400, "Can't update the playlist");
    }

    return res.status(200)
        .json(new apiresponse(200, "Video removed successfully", updatedPlaylist));
});
const deletefromplaylist=asynhandler(async(req,res)=>{
    const {playlistid}=req.params
    if(!playlistid){
        throw apierrorhandler(400,"cant find the id")
    }
    const deleteplaylist=await playlist.findByIdAndDelete(playlistid)
    if(!deleteplaylist){
        throw apierrorhandler(400,"cant delete the playlist")
    }
    return res.status(200)
    .json(new apiresponse(200,"playlist deleted successfully"));
})
export {
     createplaylist,
     getuserplaylist,
     findplaylistbyid,
     addvideotoplaylist,
    removevideofromplaylist
    };