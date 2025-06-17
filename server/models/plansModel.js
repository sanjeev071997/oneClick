import mongoose from 'mongoose';

const plansSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "Category is required"],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },

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

    planPrice: {
      type: Number,
      required: [true, "Plan price is required"],
      min: [0, "Plan price must be a positive number"],
    },

    planDuration: {
      type: String,
      required: [true, "Plan duration is required"],
      enum: ["monthly", "yearly", "lifetime"],
      default: "monthly",
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
