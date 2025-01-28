import mongoose from "mongoose";
import {like} from "../model/like.model";
import apierrorhandler from "../utils/apierrorhandler";
import asyncHandler from "../middleware/asyncHandler";
import apiresponse from "../utils/apiresponse";
import { tweet } from "../model/tweet.model";
const togglevideolike = asyncHandler(async (req, res) => {
    // To toggle video like
    const { userid, videoid } = req.params;

    // Check if userid and videoid are provided
    if (!userid) {
        throw apierrorhandler("User ID not found");
    }
    if (!videoid) {
        throw apierrorhandler("Video ID not found");
    }

    // Find the video by ID
    const getvideo = await like.findOne({ _id: videoid });

    if (!getvideo) {
        throw apierrorhandler("Video not found");
    }

    // Check if the user has already liked the video
    if (getvideo.like.includes(userid)) {
        // Remove user ID from likes
        await like.updateOne(
            { _id: videoid },
            { $pull: { like: userid } }
        );
    } else {
        // Add user ID to likes
        await like.updateOne(
            { _id: videoid },
            { $addToSet: { like: userid } }
        );
    }

    return res.status(200).json(new apiresponse(200, "Video like toggled successfully"));
});

const togglecommentlike = asyncHandler(async (req, res) => {
    // To toggle comment like
    const { userid, commentid } = req.params;

    // Check if userid and commentid are provided
    if (!userid) {
        throw apierrorhandler("User ID not found");
    }
    if (!commentid) {
        throw apierrorhandler("Comment ID not found");
    }

    // Find the comment by ID
    const getcomment = await like.findOne({ _id: commentid });

    if (!getcomment) {
        throw apierrorhandler("Comment not found");
    }

    // Check if the user has already liked the comment
    if (getcomment.like.includes(userid)) {
        // Remove user ID from likes
        await like.updateOne(
            { _id: commentid },
            { $pull: 
                { like: userid }
             }//is used to remove specific value from array on basis of condition

        );
    } else {
        // Add user ID to likes
        await like.updateOne(
            { _id: commentid },
            { $addToSet: { like: userid } }
        );
    }

    return res.status(200).json(new apiresponse(200, "Comment like toggled successfully"));
})
const toggletweetlike=asyncHandler(async(req,res)=>{
    const {userid,tweetid}=req.params
    
    if(!userid||!tweetid){
        throw new apierrorhandler(400,"user id not found")
    }
    const getweet=await tweet.findOne({id:tweetid})
    if(!getweet){
        throw apierrorhandler(400,"Tweet doesnt exist")
    }
    if(getweet.includes(userid)){
        await like.updateOne({
        id:tweetid
        },{
            $pull:{                                         
                like:userid
            }
        }
    ) 
        }
        else{
            await like.updateOne({
                id:userid
            },{
                $addToSet:{
                    like:userid
                }
            })
    }

    return res.status(200)
    .json(new apiresponse(200,"tweet toggled successfully"))
})
const getallikevideos=asyncHandler(async(req,res)=>{
    const {videoid}=req.params
    //todo to get all likevideos
    if(!videoid){
        throw apierrorhandler("user id not found")
    }
     const likedvideos= await like.aggregate([
        {
            $lookup:{
                from:"like",
                localField:"_id",
                foreignField:"_id",
                as:"fetching-liked-video",
                pipeline:([
                    {
                        $project:{
                            id:videoid,
                            liked:"video"
                        }
                    }
                ])
            }
        }
     ])

     return res.status(200)
     .json(new apiresponse(200,"fetched all liked videos"))

})              

export{
getallikevideos,
likedvideos,
togglecommentlike,
toggletweetlike,
togglevideolike
}
