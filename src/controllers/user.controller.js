import {asyncHandler} from "../utils/asyncHandler.js" 
import { User } from "../model/uer.model.js"
import { ApiError }  from "../utils/apiError.js"
 import { uploadOnCloudinary } from "../utils/cloudinary.js"
 import { ApiResponse } from "../utils/apiResponse.js"

// first  make a use of helper file  asynchandler form utility


   const generateAceesTokenAndRefreshToken=async(userId)=>{
    try {
      
      const user = await User.findById(userId)
      const accessToken=user.generateAcessToken();
       const refreshToken=user.generateRefershToken()

       user.refreshToken=refreshToken
       await  user.save( { validateBeforeSave:false });     // to remove passwword validation 

        return {accessToken,refreshToken}

    } catch (error) {
      throw new ApiError(500,"something went wrong  while generating token ")
      
    }

         
   }

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


     const loginUser=asyncHandler(async(req,res)=>{
                                              // get user data 
      const {username,email,password}=req.body; 

       if(!username || !email) throw new ApiError(400," username or password is required ");  
                  // what type of login you want it depends 

                // find the user 
      
       const user= await User.findOne({
        $or:[{username},{email}]
      })  // find the user by username or email both 

      if(!user) throw new ApiError(400," user doesnot exist");

              /// check the password

      // now the function that we had made  is not   used by the User .is coorect something 
      // the function that  we want to use is directly attached to the  instance we have got  
       // heere the instance is the user  .so all the function should be  used by this method  


        const isPasswordValid=await user.isPasswordCorrect( password)

        if(!isPasswordValid) throw new ApiError(401,"Invalid user  ( password is not correct ")



          // generate acces token and refresh
          
            const {accessToken,refreshToken}=await generateAceesTokenAndRefreshToken(user._id)


          // send it by cookies 

          const loginInUser=await User.findById(user._id).select("-password -refreshToken")


          // options for cookies 
           
          const options={
            httpsOnly:true,
            secure:true
          }


          return res
          .status(200)
          .cookie("accessToken",accessToken, options)
          .cookie("refreshToken ",refreshToken,options)
          .json(
            new ApiResponse(
              200,
              {

                user:loginInUser,accessToken,refreshToken
              },
              "User logged in Successfully "
            )
          )


     })


                                          // logout function 

     const logoutUser=asyncHandler(async(req,res)=>{
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set:{ refreshToken
          
          }
        },
        {
          new:true
        }
      )
      const options={
        httpsOnly:true,
        secure:true,
        
      }

      return res
      .status(200)
      .clearCookie("accesToken ",options)
      .clearCookie("refreshToken ", options)
      .json(
        new ApiResponse( 2000,{},"User LogOut successfully ")
      )
          
     })
 export {
  registerUser,
  loginUser,
  logoutUser,
};   // export as the name not by choice of your 