import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
  

    const { email, firstName, lastName, password, phoneNumber } = req.body

    if ([email, firstName, lastName, phoneNumber, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ $or: [{ email }] })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }


    const user = await User.create({
        email,
        password,
        firstname: firstName.toLowerCase(),
        lastname: lastName.toLowerCase(),
        phonenumber:phoneNumber,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})


const LoginUser = asyncHandler(async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email) {
            throw new ApiError(400, "email is required")
        }

        const user = await User.findOne({
            $or: [ { email }]
        })

        if (!user) {
            throw new ApiError(404, "User does not exist")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials")
        }


        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged In Successfully"
                )
            )

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, '', "Invalid user credentials")
        )
    }
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email) {
        return res.status(400).json(new ApiResponse(404, null, "email Id required"));

    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));

    }

    // Generate unique token
    const { accessToken } = await generateAccessAndRefereshTokens(user._id); 

    // Send email with reset link
    const resetLink = `http://localhost:3000/reset-password?token=${accessToken}`;
    console.log(resetLink)
    // await sendResetPasswordEmail(email, resetLink);

    return res.status(200).json(new ApiResponse(200, null, "Password reset instructions sent to your email"));
});



const resetPassword = asyncHandler(async (req, res) => {

    const { newPassword } = req.body;

    const { user } = req;
    

    // Validate newPassword
    if (! newPassword) {
        throw new ApiError(400, "new password are required");
    } 
    // Reset password
    user.password = newPassword;
    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    if (!updatedUser) {
        throw new ApiError(500, "Something went wrong while reset password")
    }

    return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});



const updateProfile = asyncHandler(async (req, res) => {

    const profileLocalPath = req.file?.path

    if (!profileLocalPath) {
        throw new ApiError(400, "update file is missing")
    }

    //TODO: delete old image - assignment

    const profile = await uploadOnCloudinary(profileLocalPath)

    if (!profile.url) {
        throw new ApiError(400, "Error while uploading on update")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                profile: profile.url
            }
        },
        {new: true}
    ).select("-password")


   

    return res.status(200).json(new ApiResponse(200, profile.url, "update profile successfully"));
});




export { registerUser, LoginUser, logoutUser, forgotPassword, resetPassword, updateProfile }