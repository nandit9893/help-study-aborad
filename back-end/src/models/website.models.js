import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    copyright: {
      type: String,
    },
    websiteUrl: {
      type: String,
    },
    logo: {
      type: String,
    },
    otpTimer: {
      type: Number,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Website = mongoose.model("Website", websiteSchema);

export default Website;
