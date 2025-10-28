 import { Router } from "express";
import{ getUserChannelProfile, loginUser, logoutUser, refreshAcessToken, registerUser} from "../controllers/user.controller.js";
import {upload } from "../middlewares/multer.middleware.js"
import {verifyJWT}  from "../middlewares/auth.middleware.js"

const router=Router();
router.route("/register").post(
 upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
)

    // hit url /register then it call the post https method 
  
router.route("/login").post(loginUser)

  //secure route

router.route("/logout").post(   verifyJWT,logoutUser)

router.route("/refresh-Token").post(refreshAcessToken)

router.route("/channel/:username").get( verifyJWT,getUserChannelProfile)

  
export default router;    //  import by any name you want // userRouter  in our case 
  