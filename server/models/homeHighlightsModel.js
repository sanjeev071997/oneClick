

import mongoose from "mongoose";

const HomeHighlightsSchema = new mongoose.Schema(
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

const homeHighlightsModel = mongoose.model("HomeHighlights", HomeHighlightsSchema);

export default homeHighlightsModel;
