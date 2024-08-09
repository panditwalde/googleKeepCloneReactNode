import { Router } from "express";
import { validateUser, verifyJWT,validateLabelId, validateLabelTitle, validateLabelAndNoteIds } from "../middlewares/auth.middleware.js";
import {  updateLabelWithNote, getLabelWithNotes, addLabelWithNote } from "../controllers/labelwithnote.controller.js";
const router = Router()

// Label with Note API
router.route("/").post(verifyJWT,validateUser,validateLabelTitle, addLabelWithNote);
router.route("/:labelId").get(verifyJWT,validateUser,validateLabelId,  getLabelWithNotes);
router.route("/:labelId").put(validateLabelAndNoteIds, updateLabelWithNote);

export default router