

import mongoose from "mongoose";

const AdsSchema = new mongoose.Schema(
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

const adsModel = mongoose.model("ADS", AdsSchema);

export default adsModel;
