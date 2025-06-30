import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    rating: {
      type: String,
      required: false,
    },

    businessUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("review", reviewSchema);

export default reviewModel;
