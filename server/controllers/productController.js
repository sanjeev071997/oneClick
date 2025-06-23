import Product from "../models/productModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";

// create a new product
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// Get all products by business ID
export const getAllProductsByBusinessId = catchAsyncErrors(async (req, res, next) => {
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
});


// Get all products by Admin
export const getAllProductsByAdmin = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });
    // Check if there are no products
    if (!products || products.length === 0) {
    return next(new Errorhandler("No products found", 404));
  }
    res.status(200).json({
        success: true,
        data: products,
    });
});

// Update a product by ID
export const updateProductById = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    return next(new Errorhandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
}
);

// Delete a product by ID
export const deleteProductById = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    return next(new Errorhandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Get a product by ID
export const getProductById = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
    if (!product) {
        return next(new Errorhandler("Product not found", 404));
    }   
    res.status(200).json({
        success: true,
        data: product,
    });
});

// // Get all products
// export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
//     const products = await Product.find().sort({ createdAt: -1 });
    
//     // Check if there are no products
//     if (!products || products.length === 0) {
//         return next(new Errorhandler("No products found", 404));
//     }
    
//     res.status(200).json({
//         success: true,
//         data: products,
//     });
//     }
// );

// Get products by category ID
export const getProductsByCategoryId = catchAsyncErrors(async (req, res, next) => {
  const { categoryId } = req.params;
  const products = await Product.find({ categoryId }).sort({ createdAt: -1 });
    // Check if there are no products
    if (!products || products.length === 0) {
        return next(new Errorhandler("No products found for this category", 404));
    }
    res.status(200).json({
        success: true,
        data: products,
    });
});

// Get products by search query
export const getProductsBySearchQuery = catchAsyncErrors(async (req, res, next) => {
  const { query } = req.query;
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { details: { $regex: query, $options: 'i' } },
    ],
  }).sort({ createdAt: -1 });       
    // Check if there are no products
    if (!products || products.length === 0) {
        return next(new Errorhandler("No products found for this search query", 404));
    }
    res.status(200).json({
        success: true,
        data: products,
    });
});