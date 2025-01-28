import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js"; // Use loginUser for login
import { uploader } from "../middlewares/multer.middleware.js";
import verifyjwt from "../middlewares/userauth.middleware.js";
import logoutuser from "../middlewares/logout.middleware.js";
import { isValidObjectId } from "mongoose";

const router = Router();

// User Registration Route
router.route("/register").post(
    uploader.fields([
        { name: 'avatarimage', maxCount: 1 },
        { name: 'coverimage', maxCount: 1 }//diffrently ,mentioned the uploader field cover image and avatar image
            ]),
    registerUser
);

// User Login Route - Use appropriate controller for login
router.route("/login").post(loginUser); // Use loginUser function for login

// User Logout Route
router.route("/logout").post(verifyjwt, logoutuser);

// User Change Password
router.route("/change-password").post(verifyjwt, changeUserPassword);

// Get Current User
router.route("/current-user").get(verifyjwt, currentuser);

// Update User
router.route("/update-user").patch(verifyjwt, updateuser);

// Update Avatar Image
router.route("/avatar").patch(verifyjwt, uploader.single("avatar"), updateavatar); // Removed space in route

// Get User Profile by Username
router.route("/c/:username").get(verifyjwt, getUserProfile);

// Watch History
router.route("/history").get(verifyjwt, gettingwatch_history);

// Change Cover Image
router.route("/change-coverimage").patch(verifyjwt, updateimage);

// Get All Videos
router.route("/get-videos").get(verifyjwt, getAllVideos);

// Publish a Video
router.route("/publish-videos").post(verifyjwt, publishvideo);

// Update Video
router.route("/update-video").post(verifyjwt, updatevideo);

// Get Video by ID
router.route("/get-video/:id").get(verifyjwt, getVideoById); // Added dynamic video ID

// Delete Video
router.route("/delete-video").post(verifyjwt, deleteVideo);

// Toggle Publish Video (Ensure it's applied only where needed)
router.route("/toggle-publish-video").patch(verifyjwt, togglepublishvideo);

export default router;




