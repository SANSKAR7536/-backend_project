 import { Router } from "express";
 import{ registerUser} from "../controllers/user.controller.js";


 const router=Router();

router.route("/register").post(registerUser)

    // hit url /register then it call the post https method 
  export default router;    //  import by any name you want // userRouter  in our case 
  