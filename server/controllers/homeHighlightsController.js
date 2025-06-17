import multer from "multer";
import HomeHighlights from "../models/homeHighlightsModel.js";
import Errorhandler from "../utils/Errorhandler.js";
import cloudinary from "../utils/cloudinary.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// Multer Setup for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to upload image file to Cloudinary
const uploadBase64ToCloudinary = async (base64String) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64String}`,
      { folder: "HomeHighlights" },
      (error, result) => {
        if (error) {
          reject(new Error("Error uploading image to Cloudinary"));
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Add HomeHighlights (Supports Multiple File Uploads)
export const addHomeHighlights = catchAsyncErrors(async (req, res, next) => {
  try {
    let { images } = req.body;

    if (!images || images.length === 0) {
      return next(new Errorhandler("No images provided", 400));
    }

    // Ensure images is always an array
    images = Array.isArray(images) ? images : [images];

    const uploadPromises = images.map(async (base64) => {
      const result = await uploadBase64ToCloudinary(base64);
      return { imageUrl: result.secure_url, publicId: result.public_id };
    });

    const uploadedImages = await Promise.all(uploadPromises);
    const savedImages = await HomeHighlights.insertMany(uploadedImages);

    res.status(200).json({
      success: true,
      images: savedImages,
      message: "Home highlights images added successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get HomeHighlights Image 
export const getHomeHighlights = catchAsyncErrors(async (req, res, next) => {
  try {
   const homeHighlights = await HomeHighlights.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      homeHighlights,
      message: "Home highlights images get successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    throw new Error("Error deleting image from Cloudinary");
  }
};

// Delete About Highlights Image
export const deleteHomeHighlights = catchAsyncErrors(async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return next(new Errorhandler("No publicId provided", 400));
    }

    // Delete image from Cloudinary
    await deleteImageFromCloudinary(publicId);

    // Delete from Database
    const deletedImage = await HomeHighlights.findOneAndDelete({ publicId });

    if (!deletedImage) {
      return next(new Errorhandler("Home highlights image not found in database", 404));
    }

    res.status(200).json({
      success: true,
      message: "Home highlights image deleted successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});
