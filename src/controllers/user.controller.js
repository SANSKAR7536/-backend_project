import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../model/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken";
// first  make a use of helper file  asynchandler form utility


const generateAceesTokenAndRefreshToken = async (userId) => {
  try {

    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false });     // to remove passwword validation 

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "something went wrong  while generating  access and refresh Token ")

  }


}

const registerUser = asyncHandler(async (req, res) => {
  // WHY ASYNC IF THE ASYNCHANDLER is already  has   as we have to talk  to  db so it will take time 
  // method to register  //



  // getting the user data   
  const { fullName, email, username, password } = req.body
  //  console.log(fullName,email,username,password);


  // valdiation step ---

  //  if(fullName==="")  throw new  ApiError( 400, "fullname is required ")    // validtaion by  beginner  no bad 


  // some() function return true if any of the array element return  true 
  if (
    [fullName, email, username, password].some((field) => field?.trim() === ""              // RETURN true if any of the field is empty string 

    )
  ) {
    throw new ApiError(400, "all field are required ")                  // using a wrapper class to handle the error efficiently 
  }



  //  check  if the user  already exist 

  const existedUser = await User.findOne({
    $or: [{ email }, { username }]                   // return true if any of  theem matches  or both matches
  })

  if (existedUser) throw new ApiError(409, "user with email or username already exist ")


  // check for images and avaatr 

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //console.log(req.files)                                          


  // Multer stores uploaded files in an array (even if only one file is uploaded).
  // "avatar" is the field name -> req.files.avatar gives an array of file objects.
  // [0] picks the first uploaded file, and .path gives its location on the server.

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "avatar file is required in this ")             // as the file is required and if not found then it willm throw an error ..


  // upload them to cloudinary 

  // thats why asynncc in call back 
  // it will take time so  wrap it on await 
  const avatar = await uploadOnCloudinary(avatarLocalPath);;

  //  console.log("AVATAR FILE DONE ");
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);



  if (!avatar) throw new ApiError(400, "avatar file is required in this ")


  //   create the user and db call 
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",       // as it is not required check so take this  
    email,
    username: username.toLowerCase(),        // as in the model all were in lower case 
    password,
  })

  // db call for if the user created or not  and removing the password  and refresh token 
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )                                     // select will remove   the password and refreshToken  form it 
  if (!createdUser) throw new ApiError(500, " something is  wrong in register the user ")

  //  reposne in api and  return the user 

  return res.status(201).json(
    new ApiResponse(200, createdUser, "user registerd successfullly ")
  )
  // 

})

const loginUser = asyncHandler(async (req, res) => {
  // get user data 
  const { username, email, password } = req.body;

  if (!username && !email) throw new ApiError(400, " username or password is required ");
  // what type of login you want it depends 

  // find the user 

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })  // find the user by username or email both 

  if (!user) throw new ApiError(400, " user doesnot exist");

  /// check the password

  // now the function that we had made  is not   used by the User .is coorect something 
  // the function that  we want to use is directly attached to the  instance we have got  
  // heere the instance is the user  .so all the function should be  used by this method  


  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) throw new ApiError(401, "Invalid user   password is not correct ")



  // generate acces token and refresh

  const { accessToken, refreshToken } = await generateAceesTokenAndRefreshToken(user._id)


  // send it by cookies 

  const loginInUser = await User.findById(user._id).select("-password -refreshToken")


  // options for cookies 

  const options = {
    httpOnly: true,
    secure: true
  }



  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loginInUser, accessToken, refreshToken },
        "User logged in successfully"

      )
    )


})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: 1 }
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAcessToken = (asyncHandler(async (req, res) => {

  try {
    // 1- send the refresh token through cookies   or req.body if a mobile application is used as the cookies is not used it in ...

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) throw new ApiError(401, "refreshToken not valid unauthorised Request");

    //2- as we also have a refresh token so verify it . also the payload part is optional so we need decoded token 

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    //3- genrateRefresh token ke pass user id h as funciton me diya tha ..

    const user = await User.findById(decodedToken._id)

    if (!user) throw new ApiError(401, "Invalid Refresh Token ")


    //4-   we have full token and save token in generatacess refresh token so matchitt  with it ..

    if (incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "RefreshToken is expired or used");

    //5- use genertaeaccesand refresh tokem to genertae;

    const options = {
      httpOnly: true,
      secure: true,

    }
    const { accessToken, newrefreshToken } = await generateAceesTokenAndRefreshToken(user._id)


    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "ACCESSS TOKEN REFRESHED"
        )
      )
  } catch (error) {
    throw new ApiError(401, Error?.message)

  }




}))

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, NewPassword } = req.body
  const user = req.user?._id    // as the user is login so we can change it 
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) throw new ApiError(400, "Invalid old passwrod")

  user.password = NewPassword  // changing of password and then saving this 
  await user.save({
    validateBeforeSave: false
  })

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password is changed")
    )


})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched "))
})

const changeAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!(fullname || email)) throw new ApiError(400, "all field are required")

  const user = await User.findByIdAndUpdate(
    req?._id,
    {
      $set: {
        fullname,
        email
      }
    },
    { new: true }

  ).select("-password")
  return res
    .status(200)
    .json(new ApiResponse(200, user, "account details updated successfully"))



})

const updateUserAvatar = asyncHandler(async (req, res) => {
  const { avatarLocalPath } = req.file?.path;

  if ( !avatarLocalPath ) throw new ApiError(400, "avatar file is missing ")

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if ( !avatar.url ) throw new ApiError(400, "error while uploading on avatar")

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }

  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, "avatar file is changed"))
})


const updateUserCoverImage = asyncHandler(async (req, res) => {
  const { coverImageLocalPath } = req.file?.path;
  if (!coverImageLocalPath) throw new ApiError(400, "coverImage file is missing ")

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage.url) throw new ApiError(400, "error while uploading on coverImage")

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }

  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, "coverImage file is changed"))
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
     //  get user by  profile  url 

      const {username} =req.params
      if( !username?.trim()) throw new ApiError(400," username is missing ")

    //User find by id no  dikka

     // awiatUser.findById({username})

       const channel= await User.aggregate([
        {
          $match:{
            username:username?.toLowerCase()
          }
        },
        {
          $lookup:{
            from:"subscrptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers",

          }
        },
        {
          $lookup:{
            from:"subscrptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribeTo",

          }
        },
        {
         $addField:{
          subscribersCount:{
             $size:"$subscribers"
          },
          channelSubscribedTo:{
            $size:"$subscribeTo"
          },
          isSubsribed:{
            $cond:{
              if:{ $in:[req.user?._id,"$subscribers.subscriber"]},
              then:true,
              else:false
            }
          }
         } 
        },
        {
          $project:{
            fullName:1,
            username:1,
            subscribersCount:1,
            channelSubscribedTo:1,
            isSubsribed:1,
            avatar:1,
            coverImage:1,
            email:1,


          }
        }
       ])

      // console.log(channel)

      if(!channel?.length) throw new  ApiError(400,"channel doesnot exist ")

      return res.
      status(200)
      .json(
        new ApiResponse(200,channel[0],"User channel  fetched  successfully ")
      )
})

export {
  registerUser,
  loginUser,
  getUserChannelProfile,
  getCurrentUser,
  logoutUser,
  changeAccountDetails,
  refreshAcessToken,
  changeCurrentPassword,
  updateUserAvatar,
  updateUserCoverImage,

};   // export as the name not by choice of your 