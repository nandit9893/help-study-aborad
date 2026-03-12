import Task from "../models/task.models.js";

const operationMap = {
  uppercase: (text) => text?.toUpperCase(),
  lowercase: (text) => text?.toLowerCase(),
  reverse: (text) => text?.split("")?.reverse()?.join(""),
  wordcount: (text) => text?.trim()?.split(/\s+/)?.length?.toString(),
};

const createTask = async (req, res) => {
  try {
    const { input, operation } = req.body;

    const operationHandler = operationMap[operation];

    if (!operationHandler) {
      return res.status(400).json({
        message: "Invalid operation",
      });
    }

    const result = operationHandler(input);

    const task = await Task.create({
      input,
      operation,
      status: "Success",
      output: result,
      userID: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Operation performed Successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while performing operation",
      error: error.message,
    });
  }
};

const getAllTaskLoggedInUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ userID: userId }).sort({ createdAt: -1 });
    if (tasks?.length === 0) {
      return res.status(409).json({
        success: false,
        message: "Tasks not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Tasks fetched Successfully",
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export { createTask, getAllTaskLoggedInUser };
