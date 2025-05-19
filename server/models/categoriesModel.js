import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: false,
    },
  
    url: {
      type: String,
      required: false,
    },

  },

  {
    timestamps: true,
  }
);

const categoriesModel = mongoose.model("categories", categoriesSchema);

export default categoriesModel;