
import { Note } from "../models/note.model.js"
import { asyncHandler, handleResponse } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createNote = asyncHandler(async (req, res) => {
    try {
        const { title, description, color, reminder, archive, collabrators, pin } = req.body;
        const note = await Note.create({ title, description, color, reminder, archive, collabrators, pin, userid: req.user._id });
        handleResponse(ApiResponse, res, 201, note, "Note created successfully.");

    } catch (error) {
        console.error("Error creating note:", error);
        handleResponse(ApiResponse,res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});


const getAllNotes = asyncHandler(async (req, res) => {
    try {

        const userNotes = await Note.aggregate([
            {
                $match: { userid: req.user._id.toString() }
            },
            {
                $lookup: {
                    from: "labels",
                    localField: "listOfLabels",
                    foreignField: "_id",
                    as: "listOfLabels"
                }
            },
            {
                $addFields: {
                    listOfLabels: {
                        $map: {
                            input: "$listOfLabels",
                            as: "label",
                            in: {
                                _id: "$$label._id",
                                label_title: "$$label.label_title"
                            }
                        }
                    }
                }
            }
        ]);
        handleResponse(ApiResponse, res, 201, userNotes, "User all Notes details.");

    } catch (error) {
        console.error("Error getting note:", error);
        handleResponse(handleResponse,res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});

const updateNote = asyncHandler(async (req, res) => {
    try {
        const updatedNote = await Note.findOneAndUpdate({ _id: req.params.noteId }, req.body)
        handleResponse(ApiResponse,res, 201, updatedNote, "Note updated successfully.");


    } catch (error) {
        console.error("Error updating note:", error);
        handleResponse(ApiResponse, res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});


const deleteNote = asyncHandler(async (req, res) => {
    try {

        await Note.deleteOne({ _id: req.params.noteId });
        handleResponse(ApiResponse,res, 201, "", "Note deleted successfully.");


    } catch (error) {
        console.error("Error deleting note:", error);
        handleResponse(ApiResponse,res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});


const searchNote = asyncHandler(async (req, res) => {
    try {

        const foundNote = await Note.find({
            $or: [
                { title: { $regex: new RegExp(req.params.searchData, 'i') } },
                { description: { $regex: new RegExp(req.params.searchData, 'i') } }
            ]
        }).exec();

        handleResponse(ApiResponse,res, 201, foundNote, "Note details.");

    } catch (error) {
        console.error("Error deleting note:", error);
        handleResponse(ApiResponse,res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});

const updateNoteCollaborator = asyncHandler(async (req, res) => {
    try {

        const operation = req.query.add ? "$addToSet" : "$pull";

        await Note.updateOne({ _id: req.params.noteId }, { [operation]: { collaborators: req.query.collaborator } });

        const successMessage = req.query.add ? "Collaborator added with note successfully." : "Collaborator removed with note successfully.";

        handleResponse(ApiResponse, res, 201, "", successMessage);

    } catch (error) {
        // Handle errors
        console.error("Error updating note collaborator:", error);
        handleResponse(ApiResponse, res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});


export { createNote, getAllNotes, updateNote, deleteNote, searchNote, updateNoteCollaborator };