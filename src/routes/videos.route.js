import { Router } from "express";
import {verifyJWT}  from "../middlewares/auth.middleware.js"
import { deleteVideo, getAllVideos, getVideoById, togglePublishStatus, updateVideo } from "../controllers/video.controller.js"
import {upload } from "../middlewares/multer.middleware.js"
const router=Router();



router.route("/getvidoes").get(verifyJWT, getAllVideos)

router.route("/getvideo/:videoId").get(verifyJWT, getVideoById)

router.route("/update/:videoId").put(verifyJWT, updateVideo);

router.route("/delete/:videoId").get(verifyJWT, deleteVideo);

router.route("/toggle-publish/:videoId").get(verifyJWT, togglePublishStatus);




export default router;
