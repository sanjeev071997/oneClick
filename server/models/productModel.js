import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  details: {
    type: String,
    default: '',
  },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  totalPrice: {
    type: Number,
    default: 0, // can also be computed in pre-save
  },
}, {
  timestamps: true,
});

productSchema.pre('save', function (next) {
  this.totalPrice = this.price - (this.price * this.discount / 100);
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
