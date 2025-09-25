import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app=express();


            // setting middleware //
 app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
 }))    // MIDDLE WARE OF CORS 

 app.use(express.json({limit:'16kb'})) // limit the use of json content giving by the  user or client

 app.use(express.urlencoded({
    extended:true,limit:"16kb"
 })) // encode the specially charcter in the url 

  app.use(express.static("public")) // middleware to save all the aserts like pdf image video  etc..

  
  app.use(cookieParser()) //middleware for  the cookie done by an external cookie parser ..

  //routes import
  import userRouter from "./routes/user.route.js"

  
  // routes
  app.use("/api/v1/users",userRouter)     // best practice to use this  as api then version then route   
  
  //  whenever hit this it will pass the route to userRouter and then it wil call  register method then post then async handler do its job  and then we  have  got or api response that is  " here it is my first code "


 // htpps:localhost:8000/api/v1/users/register   // this is the url to hit the api



   export { app };
