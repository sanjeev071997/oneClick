import Enquiry from "../models/enquiryModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";

// Add Enquiry
export const addEnquiry = catchAsyncErrors(async (req, res, next) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.status(200).json({
      success: true,
      newEnquiry,
      message: "Enquiry added successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get Enquiry
export const getEnquiry = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const enquiry = await Enquiry.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name phone email").populate("businessId");
    res.status(200).json({
      success: true,
      data: enquiry,
      message: "Enquiry details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// updateEnquiry
export const updateEnquiry = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.body;
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return next(new Errorhandler("Enquiry not found", 404));
    }
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      updatedEnquiry,
      message: "Enquiry updated successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// deleteEnquiry
export const deleteEnquiry = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.body;
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return next(new Errorhandler("Enquiry not found", 404));
    }
    await enquiry.remove();
    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});


// Admin Get all Enquiries
export const adminGetEnquiry = catchAsyncErrors(async (req, res, next) => {
  try {
    const enquiry = await Enquiry.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name phone email")
      .populate("businessId", "businessName images");
    res.status(200).json({
      success: true,
      data: enquiry,
      message: "Enquiry details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});