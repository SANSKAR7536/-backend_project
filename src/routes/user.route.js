 import { Router } from "express";
import{ changeCurrentPassword, getCurrentUser, getUserChannelProfile, getwatchedHistory, loginUser, logoutUser, refreshAcessToken, registerUser, updateUserAvatar, updateUserCoverImage} from "../controllers/user.controller.js";
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



router.route("/change-password").post( verifyJWT,changeCurrentPassword)

router.route("/current-user").get( verifyJWT,getCurrentUser)

router.route("/updated-details").patch( verifyJWT,updateUserAvatar)

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/channel/:username").get( verifyJWT ,getUserChannelProfile)

router.route("/history").get(verifyJWT,getwatchedHistory)

  
export default router;    //  import by any name you want // userRouter  in our case 
  