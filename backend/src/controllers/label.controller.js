import { Label } from "../models/label.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Function to handle errors and send response
const handleResponse = (res, statusCode, data, message) => {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

const createLabel = asyncHandler(async (req, res) => {

    try {
        const label = await Label.create({ ...req.body, userid: req.user._id });
        handleResponse(res, 201, label, "Label created successfully.");


    } catch (error) {
        // Handle errors
        console.error("Error creating label:", error);
        handleResponse(res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
}
);

const getUserLabels = asyncHandler(async (req, res) => {

    try {
        // Fetch user labels with associated notes
        const userLabels = await Label.aggregate([
            {
                $match: { userid: req.user._id.toString() }
            },
            {
                $lookup: {
                    from: "notes", // Assuming the name of your notes collection is "notes"
                    localField: "listOfNote",
                    foreignField: "_id",
                    as: "listOfNote"
                }
            }
        ]);
        
        handleResponse(res, 200, userLabels, "User's all labels details.");

    } catch (error) {

        console.error("Error geting note:", error);
        handleResponse(res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});

const updateLabel = asyncHandler(async (req, res) => {
    try {

        const updatedLabel = await Label.findOneAndUpdate({ _id: req.params.labelId }, req.body, { new: true });
        handleResponse(res, 200, updatedLabel, "Label updated successfully.");

    } catch (error) {
        handleResponse(res, error.statusCode || 500, null, error.message || "Internal Server Error");
    }
});

const deleteLabel = asyncHandler(async (req, res) => {

    try {
        await Label.deleteOne({ _id: req.params.labelId });
        handleResponse(res, 200, "", "Label deleted successfully.");

    } catch (error) {
        handleResponse(res, error.statusCode || 500, null, error.message || "Internal Server Error");

    }
});

export { createLabel, getUserLabels, updateLabel, deleteLabel };
