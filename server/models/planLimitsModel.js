import mongoose from "mongoose";

const planLimitsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Assuming your user model is called 'users'
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plans",
      required: true,
    },
    businessProfileLimit: { type: Number, default: 0 },
    businessImageLimit: { type: Number, default: 0 },
    productLimit: { type: Number, default: 0 },
    productImageLimit: { type: Number, default: 0 },
    enquiryForm: { type: Boolean, default: false },
    allowReviews: { type: Boolean, default: false },
    whatsappOrders: { type: Boolean, default: false },
    leadTrackingDashboard: { type: Boolean, default: false },
    featuredInSearch: { type: Boolean, default: false },
    socialMediaLinks: { type: Boolean, default: false },
    verifiedBadge: { type: Boolean, default: false },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const planLimitsModel = mongoose.model("planlimits", planLimitsSchema);

export default planLimitsModel;
