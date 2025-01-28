import { v2 as cloudinary } from 'cloudinary';
 // 'response' is unused, you can safely remove this import
import fs from 'fs';

(async function () {
  // Configuration
  cloudinary.config({
    api_key: process.env.CLOUD_APIKEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.CLOUD_APISECRET, // Corrected misplaced comment
  });

  const filehandler = async (filepath) => {
    try {
      if (!filepath) {
        console.error("We are unable to fetch the file");
        return null; // Ensure function returns when filepath is null or undefined
      } else {
        const response = await cloudinary.uploader.upload(filepath, {
          resource_type: "auto",
        });
        console.log("File uploaded successfully");
        const url = response.url;
        console.log("Uploaded file successfully", url);
        return response;
      }
    } catch (error) {
      fs.unlinkSync(filepath); // Fixed incorrect argument; use 'filepath' instead of 'filehandler'
      console.error("Error during file upload:", error); // Added error logging for better debugging
      return null;
    }
  };

  // Example usage (if needed)
  // const result = await filehandler("path/to/your/file.jpg");
})();
export {cloudinary}