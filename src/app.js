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

  app.use(express.static("public")) // middleware to save all the aserts like pdf image video  etc

  app.use(cookieParser()) //middleware for  the cookie done by an external cookie parser 


