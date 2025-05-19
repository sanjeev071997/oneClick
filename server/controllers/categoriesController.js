import Categories from "../models/categoriesModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";
import cloudinary from "../utils/cloudinary.js";

// Add Categories
// Function to handle base64 image uploads
const uploadBase64Image = async (base64Image) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "Categories",
    });
    // return result.secure_url;
    return {
      url: result.secure_url,
      cloudinaryId: result.public_id,
    };
  } catch (error) {
    throw new Error("Error uploading base64 image");
  }
};

// Get Categories
export const addCategories = catchAsyncErrors(async (req, res, next) => {
  const { name, categoryImage } = req.body;

  let categoryImageUrl = "";
  let cloudinaryId = "";

  try {
    if (categoryImage && categoryImage.startsWith("data:image")) {
      const result = await uploadBase64Image(categoryImage);
      categoryImageUrl = result.url;
      cloudinaryId = result.cloudinaryId;
    } else if (categoryImage) {
      const result = await cloudinary.uploader.upload(categoryImage, {
        folder: "Categories",
      });
      categoryImageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    const newCategories = await Categories.create({
      name,
      url: categoryImageUrl,
      cloudinaryId,
    });

    res.status(200).json({
      success: true,
      message: "Category added successfully",
      newCategories,
    });
  } catch (error) {
    console.log("Detailed Error:", error);
    return next(
      new Errorhandler("Error processing category upload or creation", 500)
    );
  }
});

// Get Categories
export const getCategories = catchAsyncErrors(async (req, res, next) => {
  try {
    const getCategories = await Categories.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      getCategories,
      message: "Categories details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Update Categories
export const updateCategories = catchAsyncErrors(async (req, res, next) => {
  const { id, name, categoryImage } = req.body;

  const category = await Categories.findById(id);
  if (!category) {
    return next(new Errorhandler("Category not found", 404));
  }

  // Handle category image upload
  let categoryImageUrl = category.url;
  let cloudinaryId = category.cloudinaryId;

  try {
    if (req.file) {
      // If a new file is uploaded via multer
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Categories",
      });
      categoryImageUrl = result.secure_url;
      cloudinaryId = result.public_id;

      // Delete the old image from Cloudinary if it exists
      if (category.cloudinaryId) {
        await cloudinary.uploader.destroy(category.cloudinaryId);
      }
    } else if (categoryImage && categoryImage.startsWith("data:image")) {
      const uploadResult = await uploadBase64Image(categoryImage);
      categoryImageUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;

      // Delete the old image from Cloudinary if it exists
      if (category.cloudinaryId) {
        await cloudinary.uploader.destroy(category.cloudinaryId);
      }
    } else if (categoryImage) {
      // If a new image URL is provided
      const result = await cloudinary.uploader.upload(categoryImage, {
        folder: "teachers",
      });
      categoryImageUrl = result.secure_url;
      cloudinaryId = result.public_id;

      // Delete the old image from Cloudinary if it exists
      if (category.cloudinaryId) {
        await cloudinary.uploader.destroy(category.cloudinaryId);
      }
    }
  } catch (error) {
    return next(new Errorhandler("Error updating categories image", 500));
  }

  // Update the category details
  try {
    const categories = await Categories.findByIdAndUpdate(
      id,
      {
        cloudinaryId,
        url: categoryImageUrl,
        name,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      categories,
      message: "Categories details updated successfully",
    });
  } catch (error) {
    logger.error(error);
    return next(new Errorhandler(error.message, 500));
  }
});

// Delete Categories
export const deleteCategories = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body;
  try {
    // Find the Categories by ID
    const categories = await Categories.findById(id);
    if (!categories) {
      return next(new Errorhandler("Categories not found", 404));
    }

    // Delete the image from Cloudinary if it exists
    if (categories.cloudinaryId) {
      await cloudinary.uploader.destroy(categories.cloudinaryId);
    }

    // Delete the categories from the database
    await Categories.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Categories deleted successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});
