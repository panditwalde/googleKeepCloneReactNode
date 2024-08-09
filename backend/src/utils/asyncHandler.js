
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


// Function to handle errors and send response
export const handleResponse = (ApiResponse,res, statusCode, data, message) => {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

export { asyncHandler }

