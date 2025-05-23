import Review from "../models/reviewModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";

// Add Review
export const addReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(200).json({
      success: true,
      newReview,
      message: "Review added successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get Review
export const getReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { businessId } = req.body;
    const review = await Review.find({ businessId })
      .sort({ createdAt: -1 })
      .populate("reviewer");
    res.status(200).json({
      success: true,
      data: review,
      message: "Review details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// User Get all reviews
export const userGetReview = catchAsyncErrors(async (req, res, next) => {
  const  id  = req.user.id;

  if (!id) {
    return next(new Errorhandler("User not found", 404));
  }

  const review = await Review.find({ reviewer: id })
    .sort({ createdAt: -1 })
    .populate("reviewer", "name")
    .populate("businessId", "businessName images");
  
  res.status(200).json({
    success: true,
    data: review,
    message: "User reviews fetched successfully",
  });
});
