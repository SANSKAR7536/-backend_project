import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../model/video.model.js";
import { ApiResponse } from "../utils/apiResponse.js"
import mongoose from "mongoose";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const skipPage=(page-1)*limit
    const limitPage=parseInt(limit);
    

    if ([query, sortBy, sortType, userId].some((field) => field?.trim() === "")) throw new ApiError(400, " all fields are  required ")

    const videosFiles = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)    // gives the user  based on userId
            }
        },
        {
            $sort:{
                [sortBy]:sortType=="desc"?-1:1
            }
        },
        {
            $skip:skipPage
        },
        {
            $limit:limitPage
        },
        {
          $project:{
            _id:0,
            videoFile:1,
            thumbnail:1,
            title:1,
            description:1,
            duration:1,
            views:1,
            createdAt:1,
            updatedAt:1,
          }  
        }


    ])
    if (!videosFiles) throw new ApiError(404, `no videos found with this ${userId}`);

    return res
.status(200)
.json(new ApiResponse(200,videosFiles, " vidoes fetched successfully!!"))
    

})
const uploadVideo=asyncHandler(async(req,res)=>{
    const { title , description }=req.body;
    const{ videoLocalPath }=req.files?.videofile[0].path;


    if([description,title].some((field)=>{ file?.trim()===""}))  throw new ApiError( 400, " descrption  or title is required ")
    if( !videoLocalPath) throw new ApiError( 400, "video  is required ")


    const videoFilePath=await uploadOnCloudinary(videoLocalPath);

    if(!videoFilePath) throw new ApiError( 400," error at uploading the video at claudinary ");

    const duration=(videoFilePath.duration / 60).toFixed(2);  

    const video =await new Video.create({
        videoFile:videoFilePath,
        thumbnail:5,
        owner:req.user._id,
        title:title,
        description:description,
        duration:duration,
        views:5,



    })

})
export {
     getAllVideos,


}