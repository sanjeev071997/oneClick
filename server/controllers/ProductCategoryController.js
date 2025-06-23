import ProductCategory from "../models/productCategoryModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";

// create a new product category
export const createProductCategory = catchAsyncErrors(async (req, res, next) => {
  const category = new ProductCategory(req.body);
  await category.save();
  res.status(201).json({
    success: true,
    message: "Product category created successfully",
    data: category,
  });
});

// Get all product categories
export const getAllProductCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await ProductCategory.find({businessId}).sort({ createdAt: -1 });

  // Check if there are no categories
  if (!categories || categories.length === 0) {
    return next(new Errorhandler("No product categories found", 404));
  }

  res.status(200).json({
    success: true,
    data: categories,
  });
});

// Update a product category by ID
export const updateProductCategoryById = catchAsyncErrors(async (req, res, next) => {
  const { categoryId } = req.params;
  const updatedCategory = await ProductCategory.findByIdAndUpdate(categoryId, req.body, {
    new: true,
    runValidators: true,
  });
    if (!updatedCategory) {
        return next(new Errorhandler("Product category not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Product category updated successfully",
        data: updatedCategory,
    });
});


// Delete a product category by ID
export const deleteProductCategoryById = catchAsyncErrors(async (req, res, next) => {
  const { categoryId } = req.params;
  const deletedCategory = await ProductCategory.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    return next(new Errorhandler("Product category not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product category deleted successfully",
  });
}); 

// Get All Categories by Admin
export const getAllProductCategoriesByAdmin = catchAsyncErrors(async (req, res, next) => {
  const categories = await ProductCategory.find().sort({ createdAt: -1 });  
    // Check if there are no categories
    if (!categories || categories.length === 0) {
    return next(new Errorhandler("No product categories found", 404));
    }
    res.status(200).json({
        success: true,
        data: categories,
    });
});


