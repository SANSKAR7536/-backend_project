import { Playlist } from "../model/playlist.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if ([name, description].some((field) => field?.trim() === "")) throw new ApiError(400, " all filed are required")

    const existedPlaylist = await Playlist.findOne({
        name: name.trim().toLowerCase(),
        owner: req.user._id,
    });



    if (existedPlaylist) throw new ApiError(400, "playlist with this name already exists ")


    const playList = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: []
    })

       if (playList.owner._id !== req.user._id) 
    throw new ApiError(403, "You are not authorized to view this playlist");
    

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    playList,
                    "playlist created successfully",
                )
            )

        
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) throw new ApiError(400, "playListId is required")



    const playList = await Playlist.findById(playlistId)


    if (!playList) throw new ApiError(404, "no playlist is found with this playlistId")

    if (playList.owner._id !== req.user._id) 
        throw new ApiError(403, "You are not authorized to view this playlist");
    


    return res.
        status(200)
        .json(
            new ApiResponse(
                200,
                playList,
                "playlist fetched successfully"
            )
        )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    console.log(playlistId);
    

   if(!playlistId) throw new ApiError(404,"playlistId is required")

   const playList = await Playlist.findByIdAndDelete(playlistId);

    

        if (playList.owner!== req.user._id) 
    throw new ApiError(403, "You are not authorized to delete this playlist");
//   }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "playlist deleted successfully",
        )
    )

})


export {
    createPlaylist,
    getPlaylistById,
    deletePlaylist

}