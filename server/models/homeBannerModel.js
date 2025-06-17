

import mongoose from "mongoose";

const homebannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
      unique: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const homeBannerModel = mongoose.model("HomeBanner", homebannerSchema);

export default homeBannerModel;
