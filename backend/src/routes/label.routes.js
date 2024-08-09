import { Router } from "express";
import { validateUser, verifyJWT,validateLabelId, validateLabelTitle } from "../middlewares/auth.middleware.js";
import { createLabel,getUserLabels, updateLabel ,deleteLabel } from "../controllers/label.controller.js";
const router = Router()

// Label API
router.route("/").post(verifyJWT,validateUser,validateLabelTitle, createLabel);
router.route("/").get(verifyJWT,validateUser,  getUserLabels);
router.route("/:labelId").put(verifyJWT,validateUser,  updateLabel);
router.route("/:labelId").delete(verifyJWT,validateUser,validateLabelId, deleteLabel);


export default router