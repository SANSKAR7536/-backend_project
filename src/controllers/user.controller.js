// first  make a use of helper file  asynchandler form utility
 import {asyncHandler} from "../utils/asyncHandler.js" 

 const registerUser=asyncHandler(async(req,res)=>{    // method to register  
    res.status(200).json({
        message:" my first code heere ",     // json repsone  
    })
 })
 export {registerUser};   // export as the name not by choice of your 