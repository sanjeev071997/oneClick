import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, "Business name is required"],
  },

  ownerName: {
    type: String,
    required: [true, "Owner name is required"],
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: (v) => /^\+\d{1,3}\s?[0-9]{10}$/.test(v),
      message: (props) =>
        `${props.value} is not a valid phone number. Please use a valid country code followed by a 10-digit number, like "+91 998XXXXXXX"!`,
    },
  },

  email: {
    type: String,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  address: {
    type: String,
    required: [true, "Address is required"],
  },

  state: {
    type: String,
    required: [true, "State is required"],
  },

  city: {
    type: String,
    required: [true, "City is required"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: [true, "Category is required"],
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User ID is required"],
  },

  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "plans",
    required: true,
  },

  description: String,

  images: [
    {
      url: String,
      public_id: String,
    },
  ],

  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    website: { type: String },
    youtube: { type: String },
    whatsapp: { type: String },
  },

  //   location: {
  //   latitude: Number,
  //   longitude: Number,
  //   city: String,
  //   state: String,
  //   country: String,
  //   address: String,
  // },

  service: {
  type: Array,
  required: [true, "Service is required"],
  },

  createdAt: {
    type: Date,
    default: () => new Date(),
  },

  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Update timestamp before saving
businessSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Delete images from Cloudinary when business is removed
businessSchema.pre("remove", async function (next) {
  try {
    const publicIds = this.images.map((img) => img.public_id);
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Business = mongoose.model("Business", businessSchema);
export default Business;
