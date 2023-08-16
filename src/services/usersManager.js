import UserModel from "../dao/models/users.js";
import { ObjectId } from 'mongoose';
import customError from "./errors/customError.js";
import EErors from "./errors/enums.js";
import log from "../config/logger.js";

class UsersManager {
    constructor() {}

    async changePassword(email, newPassword) {
        try {
            const user = await UserModel.findOne({ email: email });

            if (!user) {
                return customError.createError({
                    name: "Change password error if",
                    cause: `Error al encontrar el usuario: ${user}`,
                    message: "Invalid user",
                    code: EErors.INVALID_PARAM,
                });
            }
            if(user.password != newPassword) {
               user.password = newPassword; 
            }else{
                log.info("La contraseña es la misma que tenias antes")
                return false;
            }
            

            await user.save();

            return true; 
        } catch (error) {
            return customError.createError({
                name: "Change password error block catch",
                cause: `Error al cambiar la contraseña: ${error}`,
                message: "Invalid changePassword",
                code: EErors.DATABASE_ERROR,
            });
        }
    }

    async findUserById(userId) {
        try {
          const user = await UserModel.findById(userId);
      
          if (!user) {
            return null; 
          }
      
          return user.toJSON(); 

        } catch (error) {
          log.error(`Error al buscar el usuario con ID ${userId}: ${error.message}`);
          throw error;
        }
      }

    async upgradeUser(id){
        try {
            const user = await UserModel.findById(id);

            if(user.role === 'admin' || user.role === 'premium') {
                return false;
            }else{
                user.role = 'premium';
                await user.save();
                return true;
            }

        } catch (error) {
            log.error(error);
            return false;
        }
    }

    async estadoPremiumBaja(id){
        try {
            const user = await UserModel.findById(id);

            if(user.role === 'admin' || user.role === 'premium') {
                user.role = 'user';
                await user.save();
                return true;
            }

            return false;

        } catch (error) {
            log.error(error);
            return false;
        }
    }
  
}

export default UsersManager;