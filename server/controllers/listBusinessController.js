import Business from "../models/listBusinessModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";
import cloudinary from "../utils/cloudinary.js";
import geoip from "geoip-lite";
import Plans from "../models/plansModel.js";
// Add Business
// export const addBusiness = catchAsyncErrors(async (req, res, next) => {
//   try {
//     // Upload images to Cloudinary
//     const imageUploads = req.files.map((file) =>
//       cloudinary.uploader.upload(file.path, {
//         folder: "business-listings",
//         transformation: { width: 800, height: 600, crop: "limit" },
//       })
//     );

//     const uploadedImages = await Promise.all(imageUploads);
//     const images = uploadedImages.map((img) => ({
//       url: img.secure_url,
//       public_id: img.public_id,
//     }));

//     // Create business
//     const business = new Business({
//       ...req.body,
//       images,
//     });

//     await business.save();

//     res.status(201).json({
//       success: true,
//       data: business,
//       message: "Your business added successfully",
//     });
//   } catch (error) {
//     return next(new Errorhandler(error.message, 500));
//   }
// });

// export const addBusiness = catchAsyncErrors(async (req, res, next) => {
//   try {
//     // Upload images to Cloudinary
//     const imageUploads = req.files.map((file) =>
//       cloudinary.uploader.upload(file.path, {
//         folder: "business-listings",
//         transformation: { width: 800, height: 600, crop: "limit" },
//       })
//     );

//     const uploadedImages = await Promise.all(imageUploads);
//     const images = uploadedImages.map((img) => ({
//       url: img.secure_url,
//       public_id: img.public_id,
//     }));

//     // Parse socialLinks from JSON string if provided
//     const parsedSocialLinks = req.body.socialLinks
//       ? JSON.parse(req.body.socialLinks)
//       : {};

//     // Create business with parsed socialLinks
//     const business = new Business({
//       ...req.body,
//       images,
//       socialLinks: parsedSocialLinks,
//     });

//     await business.save();

//     res.status(201).json({
//       success: true,
//       data: business,
//       message: "Your business added successfully",
//     });
//   } catch (error) {
//     return next(new Errorhandler(error.message, 500));
//   }
// });




// Optional: region code to full state name mapping
const regionMap = {
  AN: "Andaman and Nicobar Islands",
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CG: "Chhattisgarh",
  CH: "Chandigarh",
  DD: "Daman and Diu",
  DL: "Delhi",
  GA: "Goa",
  GJ: "Gujarat",
  HR: "Haryana",
  HP: "Himachal Pradesh",
  JH: "Jharkhand",
  JK: "Jammu and Kashmir",
  KA: "Karnataka",
  KL: "Kerala",
  LA: "Ladakh",
  LD: "Lakshadweep",
  MH: "Maharashtra",
  ML: "Meghalaya",
  MN: "Manipur",
  MP: "Madhya Pradesh",
  MZ: "Mizoram",
  NL: "Nagaland",
  OD: "Odisha",
  PB: "Punjab",
  PY: "Puducherry",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TN: "Tamil Nadu",
  TR: "Tripura",
  UP: "Uttar Pradesh",
  UK: "Uttarakhand",
  WB: "West Bengal"
};

export const addBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    const { planId, socialLinks } = req.body;

    if (!planId) {
      return next(new Errorhandler("Plan ID is required", 400));
    }

    // ✅ Fetch plan details
    const selectedPlan = await Plans.findById(planId);
    if (!selectedPlan) {
      return next(new Errorhandler("Invalid Plan ID", 404));
    }

    const maxPhotos = selectedPlan.maxPhotos ?? 1;
    const allowSocialLinks = selectedPlan.canAddSocialLinks ?? false;
    const isVerifiedVendor = selectedPlan.isVerifiedVendor ?? false;

    // ✅ Upload allowed number of images to Cloudinary
    const filesToUpload = req.files.slice(0, maxPhotos);
    const imageUploads = filesToUpload.map((file) =>
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

    // ✅ Parse social links
    let parsedSocialLinks = {};
    if (socialLinks) {
      const parsed = JSON.parse(socialLinks);
      const allEmpty = Object.values(parsed).every((val) => !val?.trim());

      if (!allowSocialLinks && !allEmpty) {
        return next(
          new Errorhandler("Social links are not allowed for this plan", 403)
        );
      }

      parsedSocialLinks = parsed;
    }

    // ✅ Detect user's location from IP
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);

    const location = geo
      ? {
          latitude: geo.ll[0],
          longitude: geo.ll[1],
          city: geo.city,
          state: regionMap[geo.region] || geo.region || "",
          country: geo.country || "",
        }
      : null;

    // ✅ Create business
    const business = new Business({
      ...req.body,
      planId,
      images,
      socialLinks: parsedSocialLinks,
      isVerifiedVendor,
      location,
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
    const businesses = await Business.find()
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("planId")
    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get Business by ID
export const getBusinessByCategory = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const { category } = req.body;
      const getBusiness = await Business.find({ category })
        .sort({
          createdAt: -1,
        })
        .populate("category")
        .populate("planId");
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
      .populate("category", "name")
      .populate("userId", "name")
      .populate("planId");
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

    // Merge old and new images
    const mergedImages = images.length > 0 ? [...business.images, ...images] : business.images;

    // Parse socialLinks from JSON string if provided
    const parsedSocialLinks = req.body.socialLinks
      ? JSON.parse(req.body.socialLinks)
      : {};

    // Update business details
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      {
        ...req.body,
        images: mergedImages,
        socialLinks: parsedSocialLinks,
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
});

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
});
