import Plans from "../models/plansModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Errorhandler from "../utils/Errorhandler.js";

// Create a new plan
export const createPlan = catchAsyncErrors(async (req, res, next) => {
  const {
    planName,
    planDescription,
    monthlyPlanPrice,
    annuallyPlanPrice,
    monthlyDuration,
    annuallyDuration,
    planFeatures,
    planStatus,
  } = req.body;

  const newPlan = await Plans.create({
    planName,
    planDescription,
    monthlyPlanPrice,
    annuallyPlanPrice,
    monthlyDuration,
    annuallyDuration,
    planFeatures,
    planStatus,
  });

  res.status(201).json({
    success: true,
    message: "Plan created successfully",
    data: newPlan,
  });
});

// Get all plans Users
export const getAllPlans = catchAsyncErrors(async (req, res, next) => {
  const plans = await Plans.find({ isActive: "true" }).sort({ createdAt: -1 });

  // Check if there are no plans
  if (!plans || plans.length === 0) {
    return next(new Errorhandler("No plans found", 404));
  }

  res.status(200).json({
    success: true,
    data: plans,
  });
});

// Get all plans by Admin
export const getAllPlansByAdmin = catchAsyncErrors(async (req, res, next) => {
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

// Upddate Status a plan by ID
export const statusPlanById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new Errorhandler("Plan ID is required", 400));
  }

  // Find the plan first
  const plan = await Plans.findById(id);

  if (!plan) {
    return next(new Errorhandler("Plan not found", 404));
  }

  // Toggle isActive
  const updatedPlan = await Plans.findByIdAndUpdate(
    id,
    {
      isActive: !plan.isActive,
      updatedAt: Date.now(),
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: `Plan status updated successfully to ${
      updatedPlan.isActive ? "Active" : "Inactive"
    }`,
    data: updatedPlan,
  });
});

// Delete a plan by ID
export const deletePlanById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new Errorhandler("Plan ID is required", 400));
  }

  const deletedPlan = await Plans.findByIdAndDelete(id, { new: true });

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
