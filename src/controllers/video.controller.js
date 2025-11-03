import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../model/video.model.js";
import { ApiResponse } from "../utils/apiResponse.js"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const skipPage = (page - 1) * limit
    const limitPage = parseInt(limit);


    if ([query, sortBy, sortType, userId].some((field) => field?.trim() === "")) throw new ApiError(400, " all fields are  required ")

    const videosFiles = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)    // gives the user  based on userId
            }
        },
        {
            $sort: {
                [sortBy]: sortType == "desc" ? -1 : 1
            }
        },
        {
            $skip: skipPage
        },
        {
            $limit: limitPage
        },
        {
            $project: {
                _id: 0,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }


    ])
    if (!videosFiles) throw new ApiError(404, `no videos found with this ${userId}`);

    return res
        .status(200)
        .json(new ApiResponse(200, videosFiles, " vidoes fetched successfully!!"))


})
const uploadVideo = asyncHandler(async (req, res) => {
    console.log(req.file);
    const { title, description } = req.body;


    const videoLocalPath = req.files?.videofile?.[0]?.path;

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if ([description, title].some((field) => field?.trim() === "")) throw new ApiError(400, " descrption  or title is required ")

    if (!videoLocalPath) throw new ApiError(400, "video  is required ")

    if (!thumbnailLocalPath) throw new ApiError(400, "thumbnail is required ")

    const thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailPath) throw new ApiError(400, " error at uploading  thumbnail at cloudinary ");

    const videoFilePath = await uploadOnCloudinary(videoLocalPath);
    if (!videoFilePath) throw new ApiError(400, " error at uploading  video at cloudinary ");

    const duration = (videoFilePath.duration / 60).toFixed(2);


    const video = await new Video.create({
        videoFile: videoFilePath,
        thumbnail: thumbnailPath,
        owner: req.user._id,
        title,
        description,
        duration,
        views: 0,
        isPublished: true,

    })

    if (!video) throw new ApiError(500, "internl server error , video is not uploaded")

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                video,
                "video file uploaded successfully",
            )
        )



})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) throw new ApiError(400, " videoId is required");

    const video = await Video.findById(videoId).select("-_id -owner")

    if (!video) throw new ApiError(400, "no video found with this videoId")

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "video fetched succefully",

            )
        )


})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    if (!videoId) throw new ApiError(400, " videoId is required");
    const video = await Video.findByIdAndUpdate(
        videoId,
         { _id: videoId, owner: req.user._id },
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                

            },

        },
        {
            new: true
        }
    )

    if (!video) throw new ApiError(404, " no video found with this videoId");
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "video updated successfully",

            )
        )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
     if (!videoId) throw new ApiError(400, " videoId is required");
     if(video.owner.toString() !== req.user._id.toString()) throw new ApiError(403," you are not allowed to delete this video ");
     const video=await Video.findByIdAndDelete(videoId);
     if(!video) throw new(204 ," something wrong , video is not deleted ");

      return  res.
      status(200)
      .json(
        new ApiResponse(
            200,
            null,
            "video deleted successfully",
        )
      )



    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(400, " videoId is required");
     if(video.owner.toString() !== req.user._id.toString()) throw new ApiError(403," you are not allowed to delete this video ");
     const video=await Video.findByIdAndUpdate(
        videoId,
        { $set: { isPublished: !video.isPublished } },
        { new: true }
     );
     if(!video) throw new(204 ," something wrong , video publish status is not toggled ");
     return res.status(200)
     .json(
        new ApiResponse(
            200,
            video,
            "video publish status toggled successfully",
        )
        )

})



export {
    getAllVideos,
    uploadVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus


}