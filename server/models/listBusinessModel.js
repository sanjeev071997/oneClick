import mongoose from 'mongoose';
import cloudinary from "../utils/cloudinary.js";

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business name is required']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: (v) => /^[0-9]{10,15}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: (props) => `${props.value} is not a valid email!`
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: [true, 'Category is required']
  },
  description: String,
  images: [{
    url: String,
    public_id: String
  }],
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  }
});

// Update timestamp before saving
businessSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Delete images from Cloudinary when business is removed
businessSchema.pre('remove', async function (next) {
  try {
    const publicIds = this.images.map(img => img.public_id);
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Business = mongoose.model('Business', businessSchema);
export default Business;
