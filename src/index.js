//  connecting the databse in the index file  USING IIFI IN JS BUT THE INDEX IS MORE POLLUTED SO NOT A BETTTER APPROACH //

/*
import express from"expres";
import { DB_Name } from "./constants";
const app=express();

;(async()=>{
  try {
    
    await  mongooose.connect(`${process.env.Database_URI}/${DB_Name}`)

    app.on("error",(error)=>{
      console.log("error",error);
    }) // event  of error if the app is not able to talk to database;

    app.listen(process.env.PORT,()=>{
      console.log(`the app is listening on  ${process.env.PORT}`);
      
    }) 

  } catch (error) {
    console.log("error at connecting the mongodv",error);
    
    
  }
})()
  */

// SECOND APPROACH TO CONNECT THE DATABASE - MAKE A DIFF FILE AND EXPORT THE FUNCTION AND EXECUTE IT --

import dotenv from 'dotenv'

import connectDB from './db/database.js';
import {app} from "./app.js"

dotenv.config({
  path:'./env'
})

connectDB()
.then(()=>{
  app.listen(process.env.PORT||8000,()=>{
    console.log(`serrver is running  ${process.env.PORT}`);
    
  })
})
.catch((error)=>{
  console.log(error);
  
})





