import { Router } from "express";
import {verifyJWT}  from "../middlewares/auth.middleware.js"
import { getAllVideos } from "../controllers/video.controller.js"

const router=Router();


router.route("/getvidoes").get(verifyJWT, getAllVideos)



export default router;
