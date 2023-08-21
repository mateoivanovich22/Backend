import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import db from './db.js';

const collection = 'products';

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    default: 'admin',
  }
});

productsSchema.plugin(mongoosePaginate);
const productsModel = db.model(collection, productsSchema);

export default productsModel;
