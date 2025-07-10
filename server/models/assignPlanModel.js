import mongoose from "mongoose";

const assignPlanSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "plans",
    required: true,
  },
  businessProfileLimit: Number,
  businessImageLimit: Number,
  productLimit: Number,
  productImageLimit: Number,
  enquiryForm: Boolean,
  allowReviews: Boolean,
  whatsappOrders: Boolean,
  leadTrackingDashboard: Boolean,
  featuredInSearch: Boolean,
  socialMediaLinks: Boolean,
  verifiedBadge: Boolean,
});

export default mongoose.model("assignPlan", assignPlanSchema);
