import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cron from "node-cron";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpStartTime: {
      type: Date,
      default: null,
    },
    otpExpiryTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, fullName: this.fullName },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

userSchema.methods.setOTP = async function (otp, otpTimerInMinutes) {
  const now = new Date();
  this.otp = otp;
  this.otpStartTime = now;
  this.otpExpiryTime = new Date(now.getTime() + otpTimerInMinutes * 60 * 1000);
  await this.save();
};

userSchema.methods.verifyOTP = async function (otp) {
  if (!this.otp) return false;
  if (this.otpExpiryTime < new Date()) return false;
  const isValid = this.otp === otp;
  if (isValid) {
    this.otp = undefined;
    this.otpStartTime = undefined;
    this.otpExpiryTime = undefined;
    await this.save();
  }

  return isValid;
};

cron.schedule("* * * * *", async () => {
  await User.updateMany(
    { otpExpiryTime: { $lte: new Date() } },
    {
      $set: {
        otp: null,
        otpStartTime: null,
        otpExpiryTime: null,
      },
    }
  );
});

const User = mongoose.model("User", userSchema);

export default User;