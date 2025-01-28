// // import express, { json } from 'express'
// // import cors from 'cors';

// // const app=express();

// // app.use(cors){
    
// //     origin:process.env.CORS_FILE
// //     Credential:true;
// // }
  

// // app.use(express.json({limit:"10kb"}))

// // app.use(express.urlencoded({extended:true,limit:"16kb"}))
// // export {app};
// // //various types of handling are needed

// import express from 'express'

// const app=express();
// import userRouter from './router/user.routes.js'

// app.use('/api/v1/users',userRouter);

// export  {app}


import express from 'express';
import userRoutes from './router/user.routes.js';
 
 
// Create Express app
const app = express();
 
// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
 
// Use user routes
app.use('/api/v1/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
 

export default app;

 