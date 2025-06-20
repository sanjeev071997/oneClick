import mongoose from "mongoose";

const plansSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },

    planDescription: {
      type: String,
      required: [true, "Plan description is required"],
      trim: true,
    },
   
    planDuration: {
      type: String,
      required: [true, "Plan duration is required"],
    },

    monthlyPlanPrice: {
      type: String,
      required: [true, "Monthly plan price is required"],
    },

    yearlyPlanPrice: {
      type: String,
      required: [true, "Yearly plan price is required"],
    },

    planStatus: {
      type: String,
      required: [true, "Plan status is required"],
    },

    planFeatures: {
      type: [String],
      required: [true, "Plan features are required"],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one plan feature is required",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      required: [true, "Plan status is required"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
      required: [true, "Creation date is required"],
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      required: [true, "Update date is required"],
    },
  },
  {
    timestamps: true,
  }
);
const plansModel = mongoose.model("plans", plansSchema);

export default plansModel;
