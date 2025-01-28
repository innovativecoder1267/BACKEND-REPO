import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Corrected import

// Fixed: "new.Schema" to "mongoose.Schema"
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      trim: true,
    },
    watchhistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "video",
    },

  
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
    },
    coverimage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshtokens: {
      type: String,
    },
    

  },
  {
    avatar:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      fullname: this.fullname,
      username: this.username, // This is the payload
    },
    process.env.GENERATE_ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" } // Set access token expiration to 1 hour
  );
};

// Method to generate refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this.id,
    },
    process.env.GENERATE_REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Set refresh token expiration to 7 days
  );
};

// Export the User model
const User = mongoose.model("User", UserSchema);
  