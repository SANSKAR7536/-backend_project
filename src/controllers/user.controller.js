import {asyncHandler} from "../utils/asyncHandler.js" 
import { User } from "../model/uer.model.js"
import { ApiError }  from "../utils/apiError.js"
 import { uploadOnCloudinary } from "../utils/cloudinary.js"
 import { ApiResponse } from "../utils/apiResponse.js"
// first  make a use of helper file  asynchandler form utility

 const registerUser=asyncHandler(async(req,res)=>{           // WHY ASYNC IF THE ASYNCHANDLER is already  has   as we have to talk  to  db so it will take time 
                                           // method to register  //



                                        // getting the user data   
     const {fullName ,email,username ,password}=req.body
    //  console.log(fullName,email,username,password);

     
    // valdiation step ---

    //  if(fullName==="")  throw new  ApiError( 400, "fullname is required ")    // validtaion by  beginner  no bad 


                   // some() function return true if any of the array element return  true 
      if(
        [ fullName,email,username,password].some((field)=> field?.trim()===""              // RETURN true if any of the field is empty string 

        )
      ){
         throw new ApiError( 400, "all field are required ")                  // using a wrapper class to handle the error efficiently 
      }



                                                     //  check  if the user  already exist 

      const existedUser= await  User.findOne({
        $or:[{ email },{ username }]                   // return true if any of  theem matches  or both matches
      })

      if(existedUser) throw new ApiError(409 ,"user with email or username already exist ")


                                                      // check for images and avaatr 

      const  avatarLocalPath=req.files?.avatar[0]?.path;
       //console.log(req.files)                                          


       // Multer stores uploaded files in an array (even if only one file is uploaded).
       // "avatar" is the field name -> req.files.avatar gives an array of file objects.
        // [0] picks the first uploaded file, and .path gives its location on the server.

      const coverImageLocalPath=req.files?.coverImage[0]?.path;

      if(!avatarLocalPath) throw new ApiError(400,"avatar file is required in this ")             // as the file is required and if not found then it willm throw an error ..
      

                                                      // upload them to cloudinary 

            // thats why asynncc in call back 
            // it will take time so  wrap it on await 
     const avatar=  await uploadOnCloudinary(avatarLocalPath);;

    //  console.log("AVATAR FILE DONE ");
     const coverImage=  await uploadOnCloudinary(coverImageLocalPath);

                                                   

       if(!avatar) throw new ApiError(400,"avatar file is required in this ")    
     
    
                                                    //   create the user and db call 
           const user=await  User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url||"" ,       // as it is not required check so take this  
            email,
            username:username.toLowerCase(),        // as in the model all were in lower case 
            password,
           })

                                          // db call for if the user created or not  and removing the password  and refresh token 
        const createdUser= await User.findById(user._id).select(
          "-password -refreshToken"
         )                                     // select will remove   the password and refreshToken  form it 
        if(!createdUser) throw new ApiError(500," something is  wrong in register the user ")

                                           //  reposne in api and  return the user 

      return res.status(201).json(
           new ApiResponse(200,createdUser,"user registerd successfullly ")
      )
    // 

    })
 export {registerUser};   // export as the name not by choice of your 