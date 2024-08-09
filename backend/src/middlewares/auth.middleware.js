import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "")
       
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})

export const validateUser = (req, res, next) => {

    if (!req.user) return next(new ApiError(400, "Invalid user."));
    next();
};

export const validateLabelId = (req, res, next) => {
    const { labelId } = req.params;
    if (!labelId)  return next(new ApiError(400, "labelId is a required field."));
    next();
};

export const validateLabelTitle = (req, res, next) => {
    const { label_title } = req.body;
    if (!label_title)  return next(new ApiError(400, "label_title is a required field."));
    next();
};

export const validateLabelAndNoteIds = (req, res, next) => {
    const { noteId } = req.query;
    const { labelId } = req.params;     

    if (!labelId || !noteId)  return next(new ApiError(400, "Both labelId and noteId are required fields."));
    next();
};

export const validateNoteId = (req, res, next) => {
    const { noteId } = req.params;
    if (!noteId) return next(new ApiError(400, "noteId is a required field."));
    next();
};

export const validateTitleAndDescription = (req, res, next) => {
    const { title, description } = req.body;    
    if (!title || !description) return next(new ApiError(400, "Title and description are required fields."));
    next();
};

export const validateSearchData = (req, res, next) => {
    const { searchData } = req.params;
    if (!searchData)  return next(new ApiError(400, "searchData is a required field."));           
    next();
};

export const validateNoteIdAndCollaborator = (req, res, next) => {
    const { noteId } = req.params;
    const { collaborator } = req.query;
    if (!noteId || !collaborator)  return next(new ApiError(400, "noteId and collaborator are required fields."));    
    
    next();
};
