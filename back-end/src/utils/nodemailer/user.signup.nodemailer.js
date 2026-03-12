import nodemailer from "nodemailer";
import userSignupVerificationTemplate from "../templates/user.signup.template.js";

const userSignUpOTPVerification = async ({
  email,
  fullName,
  verificationCode,
  otpTimer,
  name,
  copyright,
  logo,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Text Processor" <${process.env.NODE_MAILER_USER}>`,
      to: email,
      subject: `Signup Verification Code (${verificationCode})`,
      html: userSignupVerificationTemplate(fullName, verificationCode, otpTimer, name, copyright, logo),
    };
    const info = await transporter.sendMail(mailOptions);
    if (info.messageId) {
      return {
        success: true,
        message: "OTP sent successfully",
      };
    }
    return {
      success: false,
      message: "Failed to send OTP",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Email Sending failed",
    };
  }
};

export default userSignUpOTPVerification;