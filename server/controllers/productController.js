import Product from "../models/productModel.js";
import PlanLimit from "../models/planLimitsModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";
import cloudinary from "../utils/cloudinary.js";

// // create a new product
// export const createProduct = catchAsyncErrors(async (req, res, next) => {
//   try {
//     let images = [];
//     // Upload images to Cloudinary if they exist
//     if (req.files && req.files.length > 0) {
//       const imageUploads = req.files.map((file) =>
//         cloudinary.uploader.upload(file.path, {
//           folder: "business-product",
//           transformation: { width: 800, height: 600, crop: "limit" },
//         })
//       );

//       const uploadedImages = await Promise.all(imageUploads);
//       images = uploadedImages.map((img) => ({
//         url: img.secure_url,
//         public_id: img.public_id,
//       }));
//     }

//     const product = new Product({
//       ...req.body,
//       images,
//     });

//     await product.save();
//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data: product,
//     });
//   } catch (error) {
//     return next(new Errorhandler(error.message, 500));
//   }
// });

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId, businessId } = req.body;

    // 1. Get user's plan limits
    const planLimits = await PlanLimit.findOne({ userId });
    if (!planLimits) {
      return next(new Errorhandler("Plan limits not found for user", 403));
    }

    // 2. Count how many products already exist for this business
    const existingProductCount = await Product.countDocuments({ businessId });
    if (existingProductCount >= planLimits.productLimit) {
      return next(
        new Errorhandler("Product limit exceeded for your current plan", 403)
      );
    }

    // 3. Upload images to Cloudinary if they exist
    let images = [];
    if (req.files && req.files.length > 0) {
      // Check if image count exceeds limit
      if (req.files.length > planLimits.productImageLimit) {
        return next(
          new Errorhandler(
            `Only ${planLimits.productImageLimit} images allowed per product in your plan`,
            403
          )
        );
      }

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

    // 4. Save the product
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
    const products = await Product.find({ businessId }).sort({ createdAt: -1 }).populate("categoryId", "name");

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

    const allProducts = await Product.find({ userId }).sort({ createdAt: -1 }).populate("categoryId", "name");
    
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
    const products = await Product.find().sort({ createdAt: -1 }).populate("categoryId", "name");
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

// // Update a product by ID
// export const updateProductById = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);

//     if (!product) {
//       return next(new Errorhandler("Product not found", 404));
//     }

//     // Handle image uploads only if files are provided
//     let newImages = [];
//     if (req.files && req.files.length > 0) {
//       const imageUploads = req.files?.map((file) =>
//         cloudinary.uploader.upload(file.path, {
//           folder: "business-Product",
//           transformation: { width: 800, height: 600, crop: "limit" },
//         })
//       );

//       const uploadedImages = await Promise.all(imageUploads);
//       newImages = uploadedImages.map((img) => ({
//         url: img.secure_url,
//         public_id: img.public_id,
//       }));
//     }

//     // Merge old and new images
//     const mergedImages = newImages.length > 0 ? [...product.images, ...newImages] : product.images;

//     // Update the product
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       {
//         ...req.body,
//         images: mergedImages,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data: updatedProduct,
//     });
//   } catch (error) {
//     return next(new Errorhandler(error.message, 500));
//   }
// });

export const updateProductById = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.body; // ✅ expecting userId in body
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }

    // ✅ 1. Fetch user plan limits
    const planLimits = await PlanLimit.findOne({ userId });
    if (!planLimits) {
      return next(new Errorhandler("Plan limits not found for user", 403));
    }

    // ✅ 2. Handle image uploads only if files provided
    let newImages = [];
    if (req.files && req.files.length > 0) {
      // Check if image count after merge exceeds limit
      const totalImages = product.images.length + req.files.length;
      if (totalImages > planLimits.productImageLimit) {
        return next(
          new Errorhandler(
            `You can only upload up to ${planLimits.productImageLimit} images per product in your plan`,
            403
          )
        );
      }

      const imageUploads = req.files.map((file) =>
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

    // ✅ 3. Merge old and new images
    const mergedImages =
      newImages.length > 0 ? [...product.images, ...newImages] : product.images;

    // ✅ 4. Update product
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

    const getProduct = await Product.findById(id).populate("businessId", "phone").populate("categoryId", "name");

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
    const allProduct = await Product.find().sort({ createdAt: -1 }).populate("businessId", "businessName phone").populate("categoryId", "name");

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