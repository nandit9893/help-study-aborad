import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    operation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Running", "Success"],
      default: "Pending",
    },
    output: {
      type: String,
      default: "",
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
