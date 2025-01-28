import mongoose ,{isvalidobjectid} from `mongoose`
import { video, Videoschema } from '../model/video.model'
import {user} from `../models/user.model`
import asynhandler from '.../utils/async.js'
import { response } from 'express'
import { apierrorhandler } from '../utils/ApiError'
import {apiresponse} from '.../utils/apiresponse'
import { cloudinary } from '../utils/cloudinary'


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    // Step 1: Validate default pagination and query
    if (page == 1 && limit == 10) {
        if (!query) {
            throw apiErrorHandler(400, "Query not found");
        }
    }

    // Step 2: Build dynamic filters
    const searchFilter = {};
    if (query) {
        searchFilter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
        ];
    }

    if (userId) {
        searchFilter.userId = userId;
    }

    // Step 3: Build sorting options
    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortType === 'asc' ? 1 : -1;
    }

    // Step 4: Handle pagination
    const skip = (page - 1) * limit;

    // Step 5: Fetch data
    const videos = await Video.find(searchFilter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

    // Step 6: Send response
    res.status(200).json({
        success: true,
        data: videos,
        pagination: {
            currentPage: Number(page),
            itemsPerPage: Number(limit),
            totalItems: await Video.countDocuments(searchFilter),
            totalPages: Math.ceil(await Video.countDocuments(searchFilter) / limit),
        },
    });
});

const publishvideo=asynhandler(async(req,res)=>{
    const {title,description}=req.body
    if(!title||!description){
        throw new apierrorhandler(400,"there is no title && no description");
    }
    const videopath=req.files?._id ?.[0]?.path
    if(!videopath){
        throw new apiresponse(400,"video path not found");
    }
    const upload=await cloudinary.uploader.upload(videopath)
    if(!upload){
        throw new apierrorhandler(400,"upload not done");
    }

    const video=await VideoSchema.create({
        description:1,
        title:1,
        videourl:upload.secure_url
    })
return res.status(200)
.json(new response(" file  fetched  successfully",video))
})
const updatevideo = asyncHandler(async (req, res) => {
    const { videoid } = req.params;
    const { title, description } = req.body;

    if (!videoid) {
        throw new apierrorhandler(400, "Video ID not found");
    }
    if (!title || !description) {
        throw new apierrorhandler(400, "Title and description not found");
    }

    const changevideo = await Videoschema.findByIdAndUpdate(
        videoid,
        {
            $set: {
                title: title,
                description: description,
            },
        },
        { new: true }
    );

    if (!changevideo) {
        throw new apierrorhandler(400, "Video not found");
    }

    return res.status(200).json(new apiResponse(200, "Video updated successfully", changevideo));
});
 

const getVideoById = asyncHandler(async (req, res) => {
    const { videoid } = req.params;

    if (!videoid) {
        throw new apiErrorHandler(400, "Video ID not found");
    }

    // Await the result from the database
    const findingVideo = await Videoschema.findById(videoid);

    if (!findingVideo) {
        throw new apiErrorHandler(400, "Video not found");
    }

    // Returning the response
    return res.status(200).json(new apiResponse(200, "Video found successfully", findingVideo));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoid } = req.params;

    // Check if videoid is provided
    if (!videoid) {
        throw new apiErrorHandler(400, "Video ID not found");
    }

    // Delete the video
    const findvideo = await video.findByIdAndDelete(videoid);

    // If no video was found, the findvideo will be null, so you can directly return the error
    if (!findvideo) {
        throw new apiErrorHandler(400, "Video not found");
    }

    // Send success response
    return res.status(200).json(new apiResponse(200, "File deleted successfully"));
});
const togglepublishvideo = asyncHandler(async (req, res) => {
    const { videoid } = req.params;
    if(!videoid){
        throw apierrorhandler("video not found")
    }
    const findvideo=await findById(videoid)
    if(!findvideo){
        findvideo=await video.create({
            _id:videoid,
            ispublished:true,
            
        })
        return res.status(200)
        .json(new apiresponse(200,"video uploaded successfully"))
    }
    video.ispublished=!video.ispublished
    //remov it
    await video.save();//saving it 
    return res.status(200).json(new apiresponse(200, `Video ${findvideo.isPublished ? 'published' : 'unpublished'} successfully`));
})

export default{
    getAllVideos,
    publishvideo,
    getVideoById,
    deleteVideo,
    togglepublishvideo,
    updatevideo
}