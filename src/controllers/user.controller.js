import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  // first extract the email, name & password from res.body
  const { fullName, username, email, password } = req.body;
  const userInfo = {
    fullName,
    username,
    email,
    password,
  };
  // validation not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }
  // Check it the user already exists with name or email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(400, "User already exist");
  }
  if (!req.files) return;
  // Check if user uploaded the image/avatar
  const avatarLocalPath = req.files.avatar[0].path;
  const coverImageLocalPath = req.files.coverImage[0].path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Image is required");
  }
  // upload the image on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(avatar);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }
  // create user object - in db
  const user = await User.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password & refresh token failed from response
  const registeredUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!registeredUser) {
    throw new ApiError(
      400,
      "something just wen't wrong while creating the user"
    );
  }

  // return res(response)
  return res
    .status(201)
    .json(new ApiResponse(200, registeredUser, "User Created"));
});
