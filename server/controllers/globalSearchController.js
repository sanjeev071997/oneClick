// import Business from "../models/listBusinessModel.js";
// import Product from "../models/productModel.js";
// import Category from "../models/categoriesModel.js";

// export const globalSearch = async (req, res) => {
//   try {
//     const query = req.query.q?.toLowerCase() || "";
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 50;
//     const sortField = req.query.sort || "name";
//     const skip = (page - 1) * limit;

//     // Match categories first
//     const matchedCategories = await Category.find({
//       name: { $regex: query, $options: "i" },
//     });
//     const categoryIds = matchedCategories.map((cat) => cat._id);

//     // Business Search
//     const businessQuery = {
//       $or: [
//         { name: { $regex: query, $options: "i" } },
//         { address: { $regex: query, $options: "i" } },
//         { city: { $regex: query, $options: "i" } },
//         { state: { $regex: query, $options: "i" } },
//         { category: { $in: categoryIds } },
//       ],
//     };

//     const businesses = await Business.find(businessQuery)
//       .populate("category")
//       .sort({ [sortField]: 1 })
//       .skip(skip)
//       .limit(limit);

//     // Product Search
//     const productQuery = {
//       $or: [
//         { name: { $regex: query, $options: "i" } },
//         { description: { $regex: query, $options: "i" } },
//         { category: { $in: categoryIds } },
//       ],
//     };

//     const products = await Product.find(productQuery)
//       .populate("category")
//       .populate("businessId")
//       .sort({ [sortField]: 1 })
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json({
//       success: true,
//       message: "Search results",
//       data: {
//         businesses,
//         products,
//       },
//       pagination: {
//         page,
//         limit,
//       },
//     });
//   } catch (error) {
//     console.error("Search Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Search failed",
//       error: error.message,
//     });
//   }
// };


import Business from "../models/listBusinessModel.js";
import Product from "../models/productModel.js";
import Category from "../models/categoriesModel.js";

export const globalSearch = async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const sortField = req.query.sort || "name";
    const skip = (page - 1) * limit;

    // Match categories by name (we'll use their names for products later)
    const matchedCategories = await Category.find({
      name: { $regex: query, $options: "i" },
    });

    const categoryNames = matchedCategories.map((cat) => cat.name);
    const categoryIds = matchedCategories.map((cat) => cat._id);

    // Business Search
    const businessQuery = {
      $or: [
        { businessName: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { state: { $regex: query, $options: "i" } },
        { category: { $in: categoryIds } }, // ref to Category ObjectId
      ],
    };

    const businesses = await Business.find(businessQuery)
      .populate("category")
      .sort({ [sortField]: 1 })
      .skip(skip)
      .limit(limit);

    // Product Search
    const productQuery = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { details: { $regex: query, $options: "i" } },
        { category: { $in: categoryNames } }, // here: match category string
      ],
    };

    const products = await Product.find(productQuery)
      .populate("businessId", "businessName city state") // only required fields
      .sort({ [sortField]: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Search results",
      data: {
        categories: matchedCategories,
        businesses,
        products,
      },
      pagination: {
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};
