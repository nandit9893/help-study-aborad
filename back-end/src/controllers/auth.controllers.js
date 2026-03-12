import User from "../models/users.models.js";
import Website from "../models/website.models.js";
import { generateAccessAndRefreshTokenUser } from "../utils/generate.acees.refresh.token.js";
import generateOTP from "../utils/generate.otp.js";
import userSignUpOTPVerification from "../utils/nodemailer/user.signup.nodemailer.js";

const singupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName?.trim()) {
    return res.status(400).json({
      success: false,
      message: "First Name is required",
    });
  }

  if (!lastName?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Last Name is required",
    });
  }

  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(409).json({
        success: false,
        message: "Account with this email already exists",
      });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const otp = generateOTP(6);

    const websiteConfig = await Website.findOne();
    const otpTimer = websiteConfig?.otpTimer || 2;

    await newUser.setOTP(otp, otpTimer);

    const mailResult = await userSignUpOTPVerification({
      email: newUser.email,
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      verificationCode: otp,
      otpTimer,
      name: websiteConfig?.title,
      copyright: websiteConfig?.copyright,
      logo: websiteConfig?.logo,
    });

    if (!mailResult.success) {
      newUser.otp = undefined;
      newUser.otpStartTime = undefined;
      newUser.otpExpiryTime = undefined;
      await newUser.save();

      return res.status(500).json({
        success: false,
        message: mailResult.message,
      });
    }

    const userData = await User.findOne({ email }).select(
      "firstName lastName email otpStartTime otpExpiryTime"
    );

    return res.status(201).json({
      success: true,
      message: "OTP Sent to email. Please Verify to complete login",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while signup",
      error: error.message,
    });
  }
};

const verifySignUpVerificationOTP = async (req, res) => {
  const { email, otp } = req.body || {};

  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!otp?.trim()) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiryTime) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already used",
      });
    }

    if (user.otpExpiryTime < new Date()) {
      user.otp = null;
      user.otpStartTime = null;
      user.otpExpiryTime = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Request new",
      });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.otpStartTime = null;
    user.otpExpiryTime = null;
    user.isVerified = true;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Account verified successfully. Login!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Sign Up failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokenUser(user?._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    const loggedInUser = await User.findById(user?._id).select(
      "-refreshToken -password -otpStartTime -otpExpiryTime -otp"
    );
    return res.status(200).json({
      success: true,
      message: "Login Successfull",
      data: {
        user: loggedInUser,
        accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export { singupUser, loginUser, verifySignUpVerificationOTP };
