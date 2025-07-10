import Business from "../models/listBusinessModel.js";
import User from "../models/userModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";
import cloudinary from "../utils/cloudinary.js";

import Plan from "../models/plansModel.js";
import PlanLimit from "../models/planLimitsModel.js";
import AssignPlan from "../models/assignPlanModel.js";

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

//     // Update user role to 2
//     if (req.body.userId) {
//       await User.findByIdAndUpdate(req.body.userId, { role: 2 });
//     }

//     res.status(201).json({
//       success: true,
//       data: business,
//       message: "Your business added successfully",
//     });
//   } catch (error) {
//     return next(new Errorhandler(error.message, 500));
//   }
// });

export const addBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId, planId } = req.body;

    // 1. Check if plan is valid
    const selectedPlan = await Plan.findById(planId);
    if (!selectedPlan) {
      return next(new Errorhandler("Invalid plan selected", 400));
    }

    // 2. Get limits from assignPlanModel
    const planLimits = await AssignPlan.findOne({ planId });
    if (!planLimits) {
      return next(new Errorhandler("No limits found for this plan", 404));
    }

    // 3. Save limits to user PlanLimitModel if not already saved
    const alreadyAssigned = await PlanLimit.findOne({ userId });
    if (!alreadyAssigned) {
      await PlanLimit.create({
        userId,
        planId,
        ...planLimits.toObject(),
      });
    }

    // 4. Check if business profile limit exceeded
    const businessCount = await Business.countDocuments({ userId });
    if (businessCount >= planLimits.businessProfileLimit) {
      return next(new Errorhandler("Business profile limit exceeded", 403));
    }

    // 5. Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "business-listings",
          transformation: { width: 800, height: 600, crop: "limit" },
        })
      )
    );

    const images = uploadedImages.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
    }));

    if (images.length > planLimits.businessImageLimit) {
      return next(new Errorhandler("Business image limit exceeded", 403));
    }

    // ✅ 6. Block socialLinks if not allowed in plan
    // if (!planLimits.socialMediaLinks && req.body.socialLinks) {
    //   return next(
    //     new Errorhandler("Social media links are not allowed in your current plan", 403)
    //   );
    // }

    if (!planLimits.socialMediaLinks && req.body.socialLinks) {
      const links = JSON.parse(req.body.socialLinks);

      const hasAnyLink = Object.values(links).some(
        (val) => val && val.trim() !== ""
      );

      if (hasAnyLink) {
        return next(
          new Errorhandler(
            "Social media links are not allowed in your current plan",
            403
          )
        );
      }
    }

    // 7. Parse social links (only after validation)
    const parsedSocialLinks = req.body.socialLinks
      ? JSON.parse(req.body.socialLinks)
      : {};

    // 8. Save the business
    const business = new Business({
      ...req.body,
      images,
      socialLinks: parsedSocialLinks,
    });

    await business.save();

    // 9. Update user role to vendor
    await User.findByIdAndUpdate(userId, { role: 2 });

    res.status(201).json({
      success: true,
      message: "Business added and plan limits assigned successfully",
      data: business,
    });
  } catch (err) {
    return next(new Errorhandler(err.message, 500));
  }
});

// Get All Businesses
export const getAllBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    const businesses = await Business.find()
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("planId");
    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

// Get Business by category ID
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

// Get Business by ID
export const getBusinessById = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;

    const getBusiness = await Business.findById(id).populate(
      "category",
      "name"
    );

    if (!getBusiness) {
      return next(new Errorhandler("Business not found", 404));
    }

    res.status(200).json({
      success: true,
      getBusiness,
      message: "Business details fetched successfully",
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});

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
// export const updateBusiness = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { id } = req.body;
//     const business = await Business.findById(id);
//     if (!business) {
//       return next(new Errorhandler("Business not found", 404));
//     }

//     // Handle image uploads
//     let images = [];
//     if (req.files) {
//       const imageUploads = req.files.map((file) =>
//         cloudinary.uploader.upload(file.path, {
//           folder: "business-listings",
//           transformation: { width: 800, height: 600, crop: "limit" },
//         })
//       );

//       const uploadedImages = await Promise.all(imageUploads);
//       images = uploadedImages.map((img) => ({
//         url: img.secure_url,
//         public_id: img.public_id,
//       }));
//     }

//     // Merge old and new images
//     const mergedImages =
//       images.length > 0 ? [...business.images, ...images] : business.images;

//     // Parse socialLinks from JSON string if provided
//     const parsedSocialLinks = req.body.socialLinks
//       ? JSON.parse(req.body.socialLinks)
//       : {};

//     // Update business details
//     const updatedBusiness = await Business.findByIdAndUpdate(
//       id,
//       {
//         ...req.body,
//         images: mergedImages,
//         socialLinks: parsedSocialLinks,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       data: updatedBusiness,
//       message: "Your business updated successfully",
//     });
//   } catch (error) {
//     return next(new Errorhandler(error.message, 500));
//   }
// });

export const updateBusiness = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id, userId } = req.body;

    // 1. Check if business exists
    const business = await Business.findById(id);
    if (!business) {
      return next(new Errorhandler("Business not found", 404));
    }

    // 2. Get user's plan limits
    const planLimits = await PlanLimit.findOne({ userId });
    if (!planLimits) {
      return next(new Errorhandler("Plan limits not found", 403));
    }

    // 3. Handle image uploads
    let newImages = [];
    if (req.files) {
      const imageUploads = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "business-listings",
          transformation: { width: 800, height: 600, crop: "limit" },
        })
      );
      const uploadedImages = await Promise.all(imageUploads);
      newImages = uploadedImages.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
    }

    // 4. Merge old + new images
    const mergedImages = [...business.images, ...newImages];

    // 5. Check image limit
    if (mergedImages.length > planLimits.businessImageLimit) {
      return next(
        new Errorhandler("Business image limit exceeded for your plan", 403)
      );
    }

    // 6. Check social links allowed or not
    let parsedSocialLinks = {};
    if (req.body.socialLinks) {
      const parsed = JSON.parse(req.body.socialLinks);

      if (!planLimits.socialMediaLinks) {
        const hasAnyLink = Object.values(parsed).some(
          (val) => val && val.trim() !== ""
        );

        if (hasAnyLink) {
          return next(
            new Errorhandler(
              "Social media links are not allowed in your current plan",
              403
            )
          );
        }
      }

      parsedSocialLinks = parsed;
    }

    // 7. Update the business
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
