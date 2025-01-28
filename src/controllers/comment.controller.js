import mongoose from "mongoose";
import { comment } from "../model/comments.model";
import { video } from "../model/video.model";
import { apierrorhandler } from "../utils/ApiError";
import apiresponse from "../utils/APIRESPONE.JS";
import asynhandler from "../utils/asynchandler";
import { comment } from "../model/comments.model";

const getvideocomments=asynhandler(async(req,res)=>{
    //GETTING ALL VIDEO COMMENTS
    const {videoid}=req.params
    const {page=1,limit=10}=req.query
    if(!videoid){
        throw new apierrorhandler(400,"id of video not found")
    }
    if(page==1&&limit==10){
        //only then proceed
        
        const findvideo=video.findbyid(videoid)//the id we recieved from user
        if(!findvideo){
            throw new apierrorhandler(400,"unable to find video")
        }
        //next step i
        const comments=await comment.findById({videoid:videoid})
        .skip(page-1)*limit
        .limit(limit)
    } 
    if(!comments){
        throw apierrorhandler(400,"comments not found related to video")
    }
    
    return res.status(200)
    .json(new apiresponse(200,"comment found in videos"))
})


const addcomment=asynhandler(async(req,res)=>{
    //comment in other continent 
    const {videoid}=req.params
    const {comment,userid}=req.body
    if(!comment||userid){
        throw new apierrorhandler(400,"comment or user id not found");
    }
    //first task is to find where to add the comment
    const findvideo=await video.findById(videoid)
    if(!findvideo){
        throw apierrorhandler(400,"not found video")
    }
    const createcomment=await comment.create({
        video:video,
        userid:userid,
        comment:comment,
        createdat:new Date()
    })
    return res.status(200)
    .json(new apiresponse(200,"comment created successfully",createcomment))

    
})
const updateComment = asyncHandler(async (req, res) => {
    const { videoid } = req.params;
    const { newcomment } = req.body;

    if (!videoid) {
        throw new ApiErrorHandler(400, "Video ID not found");
    }
    if (!newcomment) {
        throw new ApiErrorHandler(400, "New comment not found");
    }

    const findVideo = await Video.findById(videoid); // Ensure correct schema
    if (!findVideo) {
        throw new ApiErrorHandler(400, "Video not found");
    }

    // Correctly update the comment
    const updatingComment = await Comment.findOneAndUpdate(
        { videoId: videoid }, // Match by videoId
        { $set: { comment: newcomment } }, // Update comment
        { new: true } // Return updated document
    );

    if (!updatingComment) {
        throw new ApiErrorHandler(400, "Error occurred in updating the comment");
    }

    // Return standardized API response
    return res.status(200).json(
        new ApiResponse(200, "Comment updated successfully", updatingComment)
    );

});
const deleteComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { deletedcomment } = req.body;

    // Check if videoId and deletedcomment are provided
    if (!videoId || !deletedcomment) {
        throw new ApiErrorHandler(400, "Video ID or comment not found");
    }

    // Update the comment status to 'deleted'
    const deletedComment = await Comment.findOneAndUpdate(
        { videoId, comment: undefined },  // Match the comment to delete
        { $set: { deletedcomment: true } }     // Mark the comment as deleted
    );

    if (!deletedComment) {
        throw new ApiErrorHandler(400, "Error occurred while deleting the comment");
    }

    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
});


export default{
    getvideocomments,
    addcomment,
    newcomment,
    deleteComment,
    updateComment
}