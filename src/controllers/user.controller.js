import { uploadToCloudinary } from "../utils/cloudinary.js";
import User from "../model/user.model.js";
import { apierrorhandler } from "../utils/ApiError.js";
import asyncHandler from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";
import { subsciption } from "../model/subscription.model.js";
import mongoose from "mongoose";
// import mongoose from "mongoose";
const registerUser = asyncHandler(async (req, res, next) => {
  const {fullname, username, email, password } = req.body;

  if (!username || !email || !password||!fullname) {
    throw apierrorhandler("All fields are required");
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    throw apierrorhandler(400, "User already exists");
  }
  const avatarfilepath=req.files?.avatar?.[0]?.path
  const coverImagepath=req.files?.image?.[0]?.path
  if(!avatarfilepath.url){
    throw new apierrorhandler(400,"avatar is required")
  }
  const avatarUpload=await uploadToCloudinary(avatarfilepath)
  if(coverImagepath){
    const coverimageupload=await uploadToCloudinary(coverImagepath)
  }
    
  const user = await User.create({
    fullname:fullname,
    username:username,
     email:email,
    password:password,
    avatar:avatar.url,
    coverimage:coverimage.url

        });
        if(!user){
          throw apierrorhandler(400,"error occured in registering the user")
        }

  return res.status(201).json(
    new apiresponse(201, user, "User registered successfully")
  );
});

// Login User
const loginUser = asyncHandler(async (req, res, next) => {
  const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshtoken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw apierrorhandler("Error in generating tokens");
    }
  };

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw apierrorhandler("Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw apierrorhandler(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw apierrorhandler(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshtoken");

  return res
    .status(200)
    .cookie("accesstoken", accessToken)
    .cookie("refreshtoken", refreshToken)
    .json(
      new apiresponse(
        200,
        {
          User: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { refreshtoken: undefined }, { new: true });

  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new apiresponse(200, {}, "User logged out successfully"));
});

// Change User Password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) throw apierrorhandler(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw apierrorhandler(401, "Old password is incorrect");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new apiresponse(200, {}, "Password changed successfully"));
});

// Get Current User
const currentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new apiresponse(200, req.user, "User fetched successfully"));
});

// Update User Profile
const updateUser = asyncHandler(async (req, res) => {
  const { fullname, username } = req.body;

  if (!fullname || !username) {
    throw apierrorhandler(400, "Full name and username are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { fullname, username },
    { new: true }
  );

  if (!user) {
    throw apierrorhandler(404, "User not found");
  }

  return res.status(200).json(new apiresponse(200, user, "User profile updated successfully"));
});

// Update Files
const updateavatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw apierrorhandler(400, "Avatar image is required");
  }

  const avatarUpload = await uploadToCloudinary(avatarLocalPath, "avatars");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar: avatarUpload.url },
    { new: true }
  ).select("-password -refreshtoken");

  if (!user) {
    throw apierrorhandler(404, "User not found");
  }

  return res.status(200).json(new apiresponse(200, user, "Files updated successfully"));
});
const updateimage=asyncHandler(async(req,res)=>{
  const imagepath=req.user._id?.[0]?.path
  const uploadimage=await uploadToCloudinary(imagepath)
  if(!uploadimage){
    throw new apierrorhandler(400,"there is a error")
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar: avatarUpload.url },
    { new: true }
  ).select("-password -refreshtoken");
  if(!user){
    throw new apierrorhandler(400,"there is an error in handling the coverimage")
  }

  return res
  .status(200)
  .json(new apiresponse("image uploaded successfully",uploadimage.url))

})

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw apierrorhandler("Username is required");
  }

  const channel = await User.aggregate([
    {
      $match: { username: username.trim() },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeTo",
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
        channelSubscriptionCount: { $size: "$subscribeTo" },
        isSubscribed: {
          $in: [req.user?._id, "$subscribers.subscribe"],
        },
      },
    },
    {
      $project: {
        fullname: 1,
        email: 1,
        coverImage: 1,
        avatar: 1,
        subscriberCount: 1,
        channelSubscriptionCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel.length) {
    throw apierrorhandler(404, "Channel not found");
  }

  return res.status(200).json(new apiresponse(200, channel[0], "User profile fetched successfully"));
});

const gettingwatch_history=asyncHandler(async(req,res)=>{
  const user=User.aggregate([
    {
      $match:{
        _id:new mongoose.Schema.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watcheduser",
        foreignField:"_id",
        as:"getting-data",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner-data",
              pipeline:[
                {
                  $project:{
                    fullname:1,
                    avatar:1,
                    coverImage:1
                  }
                }
              ]
            }
          },{
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
      }
      
    },
  ])
  return res.status(200)
  .json(new apiresponse(200,user[0].watcHistory,
    "watch history fetched successfully"
  ))
})

const videouploader = asyncHandler(async (req, res) => {
 const {video}=req.files
 const videopath=video[0].path
 if(!video||!videopath[0]){
  throw new apierrorhandler(400,"video is required")
 }
  try {
    const uploadinvideo=await uploadToCloudinary(videopath,"videopath")
    if(!uploadinvideo){
      throw new apierrorhandler(400,"there is an error in uploading the video")
    }                           
  } catch (error) {
    throw apierrorhandler(400,"there is an error in uploading the video")
  }
  return res
  .status(200)
  .json(new apiresponse(200,uploadinvideo.url,"video uploaded successfully"))


}
)
// Exporting All Controllers
export default {
  registerUser,
  loginUser,
  logoutUser,
  changeUserPassword,
  currentUser,
  updateUser,
  updateFiles,
  getUserProfile,
  gettingwatch_history,
  videouploader
};// Register User
