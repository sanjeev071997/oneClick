import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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

    productUserId: {
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

const productReviewModel = mongoose.model("ProductReview", productReviewSchema);

export default productReviewModel;
