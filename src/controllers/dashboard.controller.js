import mongoose, { Schema, Types } from "mongoose";
import { video } from "../model/video.model";
import { apierrorhandler } from "../utils/ApiError";
import apiresponse from "../utils/APIRESPONE.JS";
import asynhandler from "../utils/asynchandler";
import { like } from "../model/like.model";
import { subscription } from "../model/subscription.model";
import { response } from "express";
const getchannelstats = asynhandler(async (req, res) => {
    // Extract channel ID from request parameters
    const { channeld } = req.params;
    
    if (!channeld) {
      throw apierrorhandler(400, "Channel ID not found");
    }
  
    // Fetch channel information
    const findchannel = await subscription.findById(channeld);
    if (!findchannel) {
      throw apierrorhandler(400, "Channel doesn't exist");
    }
  
    // Fetch total video views
    const videosviews = await video.aggregate([
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "Video-Views"
        }
      },
      {
        $project: {
          videoviews: { $sum: "$Video-Views.views" } // Summing up views
        }
      }
    ]);
  
 
      },
      {
        $project: {
          totalLikes: { $sum: "$total-likes.count" } // Assuming count holds the number of likes
        }
      }
    );
  
    // Fetch total subscribers
    const totalsubs = await subscription.aggregate([
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscription",
          foreignField: "_id",
          as: "getting-total-subs"
        }
      },
      {
        $project: {
          totalsubs: { $sum: "$getting-total-subs.subscriber" } // Summing up the subscriber count
        }
      }
    ]);
  
    // Fetch total videos
    const totalvideos = await video.aggregate([
      {
        $match: {
          channelId: Schema.Types.ObjectId(channeld) // Use appropriate field name
        }
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "totalvideos"
        }
      },
      {
        $project: {
          totalVideos: { $size: "$totalvideos" } // Count number of videos
        }
      }
    ]);

    return res.status(200),
    videosviews,
    totalvideos,
    totalsubs,
    getlikes
  
    

    const getChannelVideos = asyncHandler(async (req, res) => {
        // TODO: Get all the videos uploaded by the channel
        const {channelId}=req.params

        if(!channelId){
            throw apierrorhandler(400,"channel id not found")
        }
        const getvideos=await video.aggregate([
            {
                $match:{
                    channelId:Schema.Types.ObjectId(channelId)
                }

            },{
                $lookup:{
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as:"get-videos"
                }
            },{
                $project:{
                    totalvideos:"$get-videos"
                }
            }
        ])
    })
  
    export{
        getchannelstats,
        getChannelVideos
    }


