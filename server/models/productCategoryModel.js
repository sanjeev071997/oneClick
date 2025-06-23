import mongoose from 'mongoose';

const productCategorySchema = new mongoose.Schema({
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
//   image: {
//     type: String,
//     default: '',
//   },
}, {
  timestamps: true,
});
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
export default ProductCategory;