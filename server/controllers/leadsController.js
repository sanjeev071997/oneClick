import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import LeadsModel from "../models/leadsModel.js";
import Business from "../models/listBusinessModel.js"
import Errorhandler from "../utils/Errorhandler.js";

// Track Business Click
export const trackBusinessClick = catchAsyncErrors(async (req, res, next) => {
try {
    const { businessId, userId} = req.body;

    if (!businessId) {
      return next(new Errorhandler("Business ID is required", 400));
    }

    await LeadsModel.create({ businessId, userId });

    res.status(200).json({
      success: true,
      message: "Lead recorded successfully",
    });
  } catch (err) {
    return next(new Errorhandler(err.message, 500));
  }
})

// Get leads for a specific business (populate user if available)
export const getBusinessClicks = catchAsyncErrors(async (req, res, next) => {
  try {
    const loggedInUserId = req.user?.id;

    // Step 1: Find all businesses owned by this user
    const businesses = await Business.find({ userId: loggedInUserId }).select("_id");

    if (!businesses || businesses.length === 0) {
      return next(new Errorhandler("No businesses found for this user", 404));
    }

    const businessIds = businesses.map((biz) => biz._id);

    // Step 2: Find all leads (clicks) for those businesses
    const leads = await LeadsModel.find({ businessId: { $in: businessIds } })
      .populate("userId", "name email phone") // Populate user name and email phone
      .populate("businessId", "businessName"); // Populate business name

    res.status(200).json({
      success: true,
      message: "All leads for your businesses",
      totalClicks: leads.length,
      data: leads,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});


// Admin: Get all tracked leads (for all businesses)
export const getAllBusinessClicks = catchAsyncErrors (async (req, res, next) => {
  try {
    const allLeads = await LeadsModel.find()
      .populate("userId", "name email")
      .populate("businessId", "businessName");

    res.status(200).json({
      success: true,
      message: "All business click leads fetched",
      totalLeads: allLeads.length,
      data: allLeads,
    });
  } catch (error) {
    return next(new Errorhandler(error.message, 500));
  }
});
