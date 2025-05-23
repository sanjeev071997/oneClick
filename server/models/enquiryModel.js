import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: false,
    },

    message: {
      type: String,
      required: false,
    },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const enquiryModel = mongoose.model("enquiry", enquirySchema);

export default enquiryModel;
