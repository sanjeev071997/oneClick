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

// Get User Business
export const getUserBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const businesses = await Business.find({ userId })
      .sort({ createdAt: -1 })
      .populate("category", "name").populate("userId", "name");
    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// update Business
export const updateBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.body;
    const business = await Business.findById(id);
    if (!business) {
      return next(new Errorhandler("Business not found", 404));
    }
    // Handle image uploads
    let images = [];
    if (req.files) {
      const imageUploads = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "business-listings",
          transformation: { width: 800, height: 600, crop: "limit" },
        })
      );

      const uploadedImages = await Promise.all(imageUploads);
      images = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
    }
    // Update business details
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      {
        ...req.body,
        images: images.length > 0 ? images : business.images,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: updatedBusiness,
      message: "Your business updated successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
}
);

// Delete Business
export const deleteBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.body;
    const business = await Business.findById(id);
    if (!business) {
      return next(new Errorhandler("Business not found", 404));
    }
    // Delete images from Cloudinary
    for (const img of business.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    // Delete business
    await Business.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Your business deleted successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
}
);


