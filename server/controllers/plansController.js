import Plans from "../models/plansModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";

// Create a new plan
export const createPlan = catchAsyncErrors(async (req, res, next) => {
  const { planName, planDescription, planPrice, planDuration, planFeatures } =
    req.body;

  if (
    !planName ||
    !planDescription ||
    !planPrice ||
    !planDuration ||
    !planFeatures
  ) {
    return next(new Errorhandler("All fields are required", 400));
  }

  const newPlan = await Plans.create({
    planName,
    planDescription,
    planPrice,
    planDuration,
    planFeatures,
  });

  res.status(201).json({
    success: true,
    message: "Plan created successfully",
    data: newPlan,
  });
});

// Get all plans
export const getAllPlans = catchAsyncErrors(async (req, res, next) => {
  const plans = await Plans.find().sort({ createdAt: -1 });

  // Check if there are no plans
  if (!plans || plans.length === 0) {
    return next(new Errorhandler("No plans found", 404));
  }

  res.status(200).json({
    success: true,
    data: plans,
  });
});

// Get a single plan by UserID
export const getPlanById = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(new Errorhandler("Plan ID is required", 400));
  }

  const plan = await Plans.findById(userId).where({ isActive: true });
  // Check if the plan exists and is active
  if (!plan || !plan.isActive) {
    return next(new Errorhandler("Plan not found or inactive", 404));
  }
  res.status(200).json({
    success: true,
    data: plan,
  });
});

// Update a plan by ID
export const updatePlanById = catchAsyncErrors(async (req, res, next) => {
  const id = req.body.id;
  const { planName, planDescription, planPrice, planDuration, planFeatures } =
    req.body;

  if (!id) {
    return next(new Errorhandler("Plan ID is required", 400));
  }

  const updatedPlan = await Plans.findByIdAndUpdate(
    id,
    {
      planName,
      planDescription,
      planPrice,
      planDuration,
      planFeatures,
      updatedAt: Date.now(),
    },
    { new: true }
  );

  if (!updatedPlan) {
    return next(
      new Errorhandler("Plan not found or could not be updated", 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Plan updated successfully",
    data: updatedPlan,
  });
});

// Delete a plan by ID
export const statusPlanById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new Errorhandler("Plan ID is required", 400));
  }

  const deletedPlan = await Plans.findByIdAndUpdate(
    id,
    { isActive: false, updatedAt: Date.now() },
    { new: true }
  );

  if (!deletedPlan) {
    return next(
      new Errorhandler("Plan not found or could not be deleted", 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Plan status updated successfully",
    data: deletedPlan,
  });
});


export const deletePlanById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new Errorhandler("Plan ID is required", 400));
  }

  const deletedPlan = await Plans.findByIdAndDelete(
    id,
    { new: true }
  );

  if (!deletedPlan) {
    return next(
      new Errorhandler("Plan not found or could not be deleted", 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Plan deleted successfully",
    data: deletedPlan,
  });
});


// export const deleteEnquiry = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { id } = req.body;
//     const enquiry = await Enquiry.findById(id);
//     if (!enquiry) {
//       return next(new Errorhandler("Enquiry not found", 404));
//     }
//     await Enquiry.findByIdAndDelete(id);
//     res.status(200).json({
//       success: true,
//       message: "Enquiry deleted successfully",
//     });
//   } catch (error) {
//     return next(new Errorhandler(error.message, 500));
//   }
// });
