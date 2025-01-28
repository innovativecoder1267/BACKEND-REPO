import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to connect to MongoDB
const connectToDatabase = async () => {
    try {
        // Check if environment variables are defined
     

        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`, {
        });
        console.log("Connected to MongoDB successfully", process.env.MONGODB_URL);
    } catch (error) {
        console.log("Error occurred while connecting to MongoDB:", error);
        process.exit(1);
    }
};

// Export the function to be used in other files
export default connectToDatabase;
