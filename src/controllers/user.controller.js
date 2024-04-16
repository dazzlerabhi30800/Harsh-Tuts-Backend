import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  console.log(userId);
  try {
    const user = await User.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something wen't wrong really");
  }
};

// REGISTER USER CONTROLLER
const registerUser = asyncHandler(async (req, res) => {
  // first extract the email, name & password from res.body
  const { fullName, username, email, password } = req.body;
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

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  // extract the email & password
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }
  // check if user exist or not
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  // if user exist check if user entered the correct password
  const passwordCorrect = await user.isPasswordCorrect(password);
  if (!passwordCorrect) {
    throw new ApiError(400, "password you entered is not valid");
  }

  // generate accessToken & refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  console.log(accessToken);
  // we are extracting user here again because above declared doesn't have refreshToken set
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  //  set cookies
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged Successfully"
      )
    );
});

// LOGOUT USER CONTROLLER
const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "You are not logged in");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ success: true, message: "user logged out successfully" });
});

export { registerUser, loginUser, logoutUser };
