import Product from "../models/productModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";
import cloudinary from "../utils/cloudinary.js";

// create a new product
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    let images = [];
    // Upload images to Cloudinary if they exist
    if (req.files && req.files.length > 0) {
      const imageUploads = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "business-product",
          transformation: { width: 800, height: 600, crop: "limit" },
        })
      );

      const uploadedImages = await Promise.all(imageUploads);
      images = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
    }

    const product = new Product({
      ...req.body,
      images,
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});


// Get all products by business ID
export const getAllProductsByBusinessId = catchAsyncErrors(
  async (req, res, next) => {
    const { businessId } = req.params;
    const products = await Product.find({ businessId }).sort({ createdAt: -1 });

    // Check if there are no products
    if (!products || products.length === 0) {
      return next(new Errorhandler("No products found for this business", 404));
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  }
);

// Get all products by user ID
export const getAllProductsByUserIdAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const { userId } = req.params;

    const allProducts = await Product.find({ userId }).sort({ createdAt: -1 });
    
    // Check if there are no products
    if (!allProducts || allProducts.length === 0) {
      return next(new Errorhandler("No products found for this business", 404));
    }

    res.status(200).json({
      success: true,
      data: allProducts,
    });
  }
);

// Get all products by Admin
export const getAllProductsByAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });
    // Check if there are no products
    if (!products || products.length === 0) {
      return next(new Errorhandler("No products found", 404));
    }
    res.status(200).json({
      success: true,
      data: products,
    });
  }
);

// Update a product by ID
export const updateProductById = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }

    // Handle image uploads only if files are provided
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const imageUploads = req.files?.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "business-Product",
          transformation: { width: 800, height: 600, crop: "limit" },
        })
      );

      const uploadedImages = await Promise.all(imageUploads);
      newImages = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
    }

    // Merge old and new images
    const mergedImages = newImages.length > 0 ? [...product.images, ...newImages] : product.images;

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        images: mergedImages,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});


// Delete a product by ID
export const deleteProductById = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }
    // Delete images from Cloudinary
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    // Delete product
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Your product deleted successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get a product by ID
export const getProductById = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;

    const getProduct = await Product.findById(id);

    if (!getProduct) {
      return next(new Errorhandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      getProduct,
      message: "Product details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get All Product User Side
export const getAllProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const allProduct = await Product.find().sort({ createdAt: -1 }).populate("businessId", "businessName phone");

    if (!allProduct) {
      return next(new Errorhandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      allProduct,
      message: "All product details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
})