import { Router } from "express";
import { verifyJWT,validateUser, validateNoteId, validateTitleAndDescription, validateSearchData, validateNoteIdAndCollaborator } from "../middlewares/auth.middleware.js";
import { createNote ,getAllNotes, updateNote, deleteNote, searchNote,updateNoteCollaborator } from "../controllers/note.controller.js";
const router = Router()


router.route("/").post(verifyJWT,validateUser,validateTitleAndDescription, createNote);
router.route("/").get(verifyJWT,validateUser, getAllNotes)
router.route("/:noteId").put(verifyJWT,validateUser,validateNoteId, updateNote)
router.route("/:noteId").delete(verifyJWT,validateUser,validateNoteId, deleteNote)
router.route("/:searchData").get(verifyJWT,validateUser,validateSearchData, searchNote)
router.route("/collaborator/:noteId").put(validateNoteIdAndCollaborator, updateNoteCollaborator)

export default router