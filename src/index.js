 
import express from 'express';
import connectToDatabase from './db/app.js'; // Import the function from db.js

// Create Express app
const app = express();
const port = process.env.PORT || 3001;

// Function to start the server
const startServer = () => {
    app.on("error", (error) => {
        console.log("There is an error, server can't listen", error);
        process.exit(1);
    });

    app.listen(port, () => {
        console.log("Server running on port", port);
    });
};

// Main function to call the connection and server startup
const main = async () => {
    await connectToDatabase(); // Call the function from db.js
    startServer(); // Start the server
};

// Call the main function to start everything
main();


 
 
 