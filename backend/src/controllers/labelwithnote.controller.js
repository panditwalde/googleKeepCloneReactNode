

import { Label } from "../models/label.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/note.model.js";

// Function to handle errors and send response
const handleResponse = (res, statusCode, data, message) => {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

const updateLabelWithNoteOpration = async (labelId, noteId, addToSet = true) => {

    const updateOperation = addToSet ? { $addToSet: { listOfNote: noteId } } : { $pull: { listOfNote: noteId } };    
    await Label.updateOne({ _id: labelId }, updateOperation);
    await Note.updateOne({ _id: noteId }, { $addToSet: { listOfLabels: labelId } });
};

const addLabelWithNote = asyncHandler(async (req, res) => {
    try {
        const label = await Label.create( { ... req.body, userid: req.user._id });
        await updateLabelWithNoteOpration(label._id, req.body.noteid);
        handleResponse(res, 201, label, "Label created with note successfully.");
    } 
    catch (error) {

        console.error("Error creating label:", error);
        handleResponse(res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});

const updateLabelWithNote = asyncHandler(async (req, res) => {
    try {

        await updateLabelWithNoteOpration(req.params.labelId, req.query.noteId,  req.query.addToSet);
        handleResponse(res, 201, null, "Label updated with note successfully.");

    } 
    catch (error) {

        console.error("Error updating label:", error);
        handleResponse(res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});

const getLabelWithNotes = asyncHandler(async (req, res) => {
    try {
       
        const  {_id } = await Label.findOne({_id:req.params.labelId})
        const userLabels = await Label.aggregate([
            { 
                $match: { _id: _id } // Match the specified labelId
            },
            {
                $lookup: {
                    from: "notes",
                    localField: "listOfNote",
                    foreignField: "_id",
                    as: "userNotes"
                }
            },
            {
                $unwind: "$userNotes" // Unwind the array of userNotes
            },
            {
                $lookup: {
                    from: "labels",
                    localField: "userNotes.listOfLabels",
                    foreignField: "_id",
                    as: "userNotes.listOfLabels"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    listOfNote: { $push: "$userNotes" } // Group userNotes back into an array
                }
            }
        ]);    
                        
        return res.status(201).json(new ApiResponse(201, userLabels?.[0]?.listOfNote || [], "User all labels details."));
    } catch (error) {

        console.error("Error deleting label:", error);
        handleResponse(res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});

export { updateLabelWithNote, getLabelWithNotes, addLabelWithNote };