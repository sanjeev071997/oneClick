import Business from "../models/listBusinessModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";
import cloudinary from "../utils/cloudinary.js";

// Add Business
export const addBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    // Upload images to Cloudinary
    const imageUploads = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "business-listings",
        transformation: { width: 800, height: 600, crop: "limit" },
      })
    );

    const uploadedImages = await Promise.all(imageUploads);
    const images = uploadedImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    // Create business
    const business = new Business({
      ...req.body,
      images,
    });

    await business.save();

    res.status(201).json({
      success: true,
      data: business,
      message: "Your business added successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get All Businesses
export const getAllBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 }).populate("category");
    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get Business by ID
export const getBusinessByCategory = catchAsyncErrors(async (req, res, next) => {
    try {
     const {category} = req.body
      const getBusiness = await Business.find({category}).sort({
        createdAt: -1}).populate("category")
      res.status(201).json({
        success: true,
        data: getBusiness,
      });
    } catch (error) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);



