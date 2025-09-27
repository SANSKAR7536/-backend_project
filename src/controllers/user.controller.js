import {asyncHandler} from "../utils/asyncHandler.js" 
// first  make a use of helper file  asynchandler form utility

 const registerUser=asyncHandler(async(req,res)=>{  
     // method to register  
       res.status(200).json({
        message:"   helllo world ",
        data:req.body// json repsone  
    })
 })
 export {registerUser};   // export as the name not by choice of your 