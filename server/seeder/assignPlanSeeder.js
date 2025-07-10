import mongoose from "mongoose";
import dotenv from "dotenv";
import AssignPlan from "../models/assignPlanModel.js"

dotenv.config();
mongoose.connect(process.env.MONGO_URL);

const assignPlans = [
  {
    planId: "686bd9c62d922c5f9254c849", // base plan _id
    businessProfileLimit: 1,
    businessImageLimit: 1,
    productLimit: 1,
    productImageLimit: 1,
    enquiryForm: true,
    allowReviews: true,
    whatsappOrders: false,
    leadTrackingDashboard: false,
    featuredInSearch: false,
    socialMediaLinks: false,
    verifiedBadge: false,
  },
  {
    planId: "686bd9142d922c5f9254c841", // standard plan _id
    businessProfileLimit: 1,
    businessImageLimit: 2,
    productLimit: 2,
    productImageLimit: 2,
    enquiryForm: true,
    allowReviews: true,
    whatsappOrders: true,
    leadTrackingDashboard: true,
    featuredInSearch: false,
    socialMediaLinks: false,
    verifiedBadge: false,
  },
  {
    planId: "686bd8102d922c5f9254c824", // premium plan _id
    businessProfileLimit: 1,
    businessImageLimit: 3,
    productLimit: 5,
    productImageLimit: 3,
    enquiryForm: true,
    allowReviews: true,
    whatsappOrders: true,
    leadTrackingDashboard: true,
    featuredInSearch: true,
    socialMediaLinks: true,
    verifiedBadge: true,
  },
  {
    planId: "686bd3e12d922c5f9254c7cd", // verified plan _id
    businessProfileLimit: 1,
    businessImageLimit: 5,
    productLimit: 15,
    productImageLimit: 5,
    enquiryForm: true,
    allowReviews: true,
    whatsappOrders: true,
    leadTrackingDashboard: true,
    featuredInSearch: true,
    socialMediaLinks: true,
    verifiedBadge: true,
  },
];

async function seed() {
  try {
    await AssignPlan.insertMany(assignPlans);
    console.log("✅ Assign Plans inserted successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting assign plans:", err);
    process.exit(1);
  }
}

seed();

// Direct Add Database 
// Command -> node seeder/assignPlanSeeder.js