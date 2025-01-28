// const express = require('express')
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

// const app = express()
 
// cloudinary.config({
//   cloud_name: procces.env.CLOUD_NAME ,
//   api_key:  process.env.CLOUD_APIKEY,
//   api_secret: process.env.CLOUD_APISECRET,
// });
// const destination=multer.diskStorage({

//   destination:(req,file,cb)=>{
//     cb(null,'temp');
//   }
// })




// Fs.unlink(filepath,(error)=>{
// console.log("there is a error",error)
// })

// export const uploader=multer({
//   storage
// })
import multer from 'multer';
 
import fs from 'fs';
import { config as cloudinaryConfig } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinaryConfig({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_APISECRET,
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer with the configured storage
export const upload = multer({ storage });

// Function to delete a file
export const deleteFile = (filepath) => {
  fs.unlink(filepath, (error) => {
    if (error) {
      console.log("There is an error", error);
    }
  });
};