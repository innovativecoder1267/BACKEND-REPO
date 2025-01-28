import mongoose from "mongoose";
import { apierrorhandler } from "../utils/ApiError";
import { apiresponse } from "../utils/apiresponse";
import asynhandler from "../utils/asynchandler";
import { tweetschema } from "../model/tweet.model";
import User from "../model/user.model";
import { uploader } from "../middlewares/multer.middleware";

// Create a tweet
const createtweet = asynhandler(async (req, res) => {
  const { userid } = req.params;
  const { content } = req.body;

  if (!userid) {
    throw apierrorhandler(400, "User ID not found");
  }
  if (!content) {
    throw new apierrorhandler(400, "Content not provided");
  }

  // Check if user exists
  const userExists = await User.findById(userid);
  if (!userExists) {
    throw apierrorhandler(404, "User not found");
  }

  // Create tweet
  const createdTweet = await tweetschema.create({
    _id: userid,
    content: content,
  });

  if (!createdTweet) {
    throw apierrorhandler(400, "Tweet creation failed");
  }

  return res.status(200).json(new apiresponse(200, "Tweet created successfully"));
});

// Get user tweets
const getusertweets = asynhandler(async (req, res) => {
  const { userid } = req.params;

  if (!userid) {
    throw apierrorhandler(400, "User ID not found");
  }

  const getuserTweets = await tweetschema.find({ _id: userid });
  if (!getuserTweets || getuserTweets.length === 0) {
    throw apierrorhandler(404, "No tweets found for this user");
  }

  return res.status(200).json(new apiresponse(200, "Tweets found successfully", getuserTweets));
});

// Update tweet
const updatetweet = asynhandler(async (req, res) => {
  const { userid } = req.params;
  const { newcontent } = req.body;

  if (!userid) {
    throw apierrorhandler(400, "User ID not found");
  }
  if (!newcontent) {
    throw new apierrorhandler(400, "Content not provided");
  }

  // Check if user exists
  const userExists = await User.findById(userid);
  if (!userExists) {
    throw apierrorhandler(404, "User not found");
  }

  // Update tweet content
  const updatedTweet = await tweetschema.findByIdAndUpdate(
    { _id: userid },
    { $set: { content: newcontent } },
    { new: true }
  );

  if (!updatedTweet) {
    throw apierrorhandler(400, "Tweet update failed");
  }

  return res.status(200).json(new apiresponse(200, "Tweet updated successfully", updatedTweet));
});

// Delete tweet
const deletetweet = asynhandler(async (req, res) => {
  const { userid } = req.params;
  const { content } = req.body;

  if (!userid) {
    throw apierrorhandler(400, "User ID not found");
  }
  if (!content) {
    throw new apierrorhandler(400, "Content not provided");
  }

  // Delete tweet by updating content to undefined
  const deletedTweet = await tweetschema.findByIdAndUpdate(
    { _id: userid },
    { $set: { content: undefined } },
    { new: true }
  );

  if (!deletedTweet) {
    throw apierrorhandler(400, "Tweet delete failed");
  }

  return res.status(200).json(new apiresponse(200, "Tweet deleted successfully", deletedTweet));
});

const updateavatar=asynhandler(async(req,res)=>{
  const {avatar}=req.params
  const {userid}=req.params

  if(!userid){
    throw apierrorhandler("not found")
  }
  if(!avatar){
    throw apierrorhandler("nof found")
  }

  const uploadnew=await uploader(avatar)
  if(!uploadnew){
    throw apierrorhandler("error occured in uplaoding")
  }
  return res.status(200)
  .json(new apiresponse(200,"avatar uplaoded successfully"))
})
export {
  createtweet,
  deletetweet,
  updatetweet,
  getusertweets,
};
