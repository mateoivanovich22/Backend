import messagesModel from "../dao/models/messages.js";
import { ObjectId } from 'mongoose';
import customError from "./errors/customError.js";
import EErors from "./errors/enums.js";

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
      return customError.createError({
        name: "Obtener message error block catch",
        cause: `Error al obtener los messages: ${error}`,
        message: "Invalid getMessages",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async getMessageById(id) {
    try {
      const message = await messagesModel.findById(new ObjectId(id)).lean();

      if (!message) {
        return customError.createError({
          name: "Obtener message error",
          cause: `Error al obtener el message with ID: ${id}`,
          message: "Invalid getMessageById",
          code: EErors.INVALID_PARAM,
        });
      }

      return message;
    } catch (error) {
      return customError.createError({
        name: "Obtener message by ID error",
        cause: `Error al obtener el message: ${error}`,
        message: "Invalid getMessageById",
        code: EErors.DATABASE_ERROR,
      });
    }
  }
}

export default MessagesManager;