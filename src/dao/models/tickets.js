import mongoose from 'mongoose';
import db from './db.js';

const collection = 'tickets';
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const TicketModel = db.model(collection, ticketSchema);

export default TicketModel;
