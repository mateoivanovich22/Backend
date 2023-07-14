import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import db from './db.js';

const collection = 'messages';


const messagesSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  message:{
    type:String,
    required:true,
  }
});

messagesSchema.statics.createMessage = async function (message) {
  try {
    const newMessage = new this(message);
    const result = await newMessage.save();
    return result;
  } catch (error) {
    console.error("Error al crear carrito:", error);
    throw error;
  }
};

messagesSchema.plugin(mongoosePaginate);
const messageModel = db.model(collection, messagesSchema);

export default messageModel;