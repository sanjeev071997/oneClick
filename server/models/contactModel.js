import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: false,
    },

    message: {
      type: String,
      required: false,
    },
  },

  {
    timestamps: true,
  }
);

const contactModel = mongoose.model("contact", contactSchema);

export default contactModel;
