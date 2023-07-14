import mongoose from "mongoose";
import db from "./db.js";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = "carts";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});


cartsSchema.statics.createCart = async function (cart) {
  try {
    const newCart = new this(cart);
    const result = await newCart.save();
    return result;
  } catch (error) {
    console.error("Error al crear carrito:", error);
    throw error;
  }
};

cartsSchema.plugin(mongoosePaginate);
const cartsModel = db.model(collection, cartsSchema);

export default cartsModel;
