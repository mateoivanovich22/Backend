import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import db from './db.js';
/*
Modificar el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto
Si un producto se crea sin owner, se debe colocar por defecto “admin”.
El campo owner deberá guardar sólo el correo electrónico (o _id, lo dejamos a tu conveniencia) del usuario que lo haya creado (Sólo podrá recibir usuarios premium)*/


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
