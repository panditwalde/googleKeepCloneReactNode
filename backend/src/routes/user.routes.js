import { Router } from "express";
import { LoginUser, logoutUser, registerUser, forgotPassword, resetPassword, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"


const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(LoginUser)

router.route("/forgot-password").post(forgotPassword)

router.route("/set-password").post(verifyJWT, resetPassword)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/update-profile").post(verifyJWT, upload.single("file"), updateProfile)


export default router


