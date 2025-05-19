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
      required: false,
    },

    rating: {
      type: String,
      required: false,
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
