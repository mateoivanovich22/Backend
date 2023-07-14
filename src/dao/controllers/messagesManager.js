import messagesModel from "../models/messages.js";
import { ObjectId } from 'mongoose';

class MessagesManager {
  constructor() {}

  async createMessage(message) {
    let newMessage = await messagesModel.create(message);

    return newMessage;
  }

  async getMessages() {
    try {
      const messages = await messagesModel.find({}).lean();
      return messages;
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      throw error;
    }
  }

  async getMessageById(id) {
    try {
      const message = await messagesModel.findById(new ObjectId(id)).lean();

      if (!message) {
        throw new Error("Carrito no encontrado");
      }

      return message;
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      throw error;
    }
  }
}

export default MessagesManager;