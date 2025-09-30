 import { v2 as cloudinary } from 'cloudinary'

//  import fs from "fs";


 cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



  const uploadOnCloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //upload the file on the cloudinary


       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // file has been uploaded successfully 
        // console.log("file  is uploaded on cloudinnary ",response.url);


      //  fs.unlinkSync(localFilePath)  // remove the locally savetemporay file as the  upload the option got successfull..
         return response;

    } catch (error) {
        /// unlink the file if not found or error is genreted 
        // fs.unlinkSync(localFilePath)  // remove the locally savetemporay file as the  upload the option got failed..
         return null;

        
    }
  }
  export {uploadOnCloudinary};