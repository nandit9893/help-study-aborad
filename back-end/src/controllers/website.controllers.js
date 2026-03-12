import Website from "../models/website.models.js";

const getWebsite = async (req, res) => {
  try {
    const websiteData = await Website.findOne();
    if (!websiteData) {
      return res.status(409).json({
        success: false,
        message: "Website data not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Website Data fetched Successfully",
      data: websiteData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching website data",
      error: error.message,
    });
  }
};

export { getWebsite };
