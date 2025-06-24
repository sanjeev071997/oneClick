import ProductReview from "../models/productReviewModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";

// Add Product Review
export const addProductReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const newProductReview = await ProductReview.create(req.body);
    res.status(200).json({
      success: true,
      newProductReview,
      message: "Product Review added successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get Product Review
export const getProductReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId } = req.body;
    const productReview = await ProductReview.find({ productId })
      .sort({ createdAt: -1 })
      .populate("reviewer");
    res.status(200).json({
      success: true,
      data: productReview,
      message: "Product Review details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// User Get all Product Review
export const userGetProductReview = catchAsyncErrors(async (req, res, next) => {
  const  id  = req.user.id;

  if (!id) {
    return next(new Errorhandler("User not found", 404));
  }

  const productReview = await ProductReview.find({ reviewer: id })
    .sort({ createdAt: -1 })
    .populate("reviewer", "name")
    .populate("productId", "name images");
  
  res.status(200).json({
    success: true,
    data: productReview,
    message: "User product review fetched successfully",
  });
});

// Update Review
export const updateProductReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.body;
    const ProductReview = await ProductReview.findById(id);
    if (!review) {
      return next(new Errorhandler("Product Review not found", 404));
    }
    ProductReview.rating = req.body.rating;
    ProductReview.comment = req.body.comment;
    await ProductReview.save();
    res.status(200).json({
      success: true,
      message: "Product Review updated successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Delete Product Review
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.body;
    const productReview = await ProductReview.findById(id);
    if (!productReview) {
      return next(new Errorhandler("Product Review not found", 404));
    }
    await ProductReview.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product Review deleted successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Admin Product Review
export const adminAllProductReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const adminProductReview = await ProductReview.find({}).sort({ createdAt: -1 }).populate("reviewer", "name")
    .populate("productId", "name images");
    res.status(200).json({
      success: true,
      adminProductReview,
      message: "All users product review fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
})