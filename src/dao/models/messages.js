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


messagesSchema.plugin(mongoosePaginate);
const messageModel = db.model(collection, messagesSchema);

export default messageModel;