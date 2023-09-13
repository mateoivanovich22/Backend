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
    async findUserByEmail(email) {
        try {
          const user = await UserModel.findOne({ email });
      
          if (!user) {
            return null; 
          }
      
          return user.toJSON(); 

        } catch (error) {
          log.error(`Error al buscar el usuario con ID ${userId}: ${error.message}`);
          throw error;
        }
    }

    async updateUserById(userId, updateData) {
        try {
          const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
          if (!user) {
            log.error(`User con id "${userId}" no encontrado`)
            return false;
          }
    
          return user.toJSON();
        } catch (error) {
            log.error("Error bloque catch updateUserbyId")
            return false;
        }
      }
      async upgradeUserWithDocuments(id) {
        try {
          const user = await UserModel.findById(id);
      
          const requiredDocuments = [
            'identification',
            'proofOfAddress',
            'bankStatement',
          ];

          const hasAllDocuments = requiredDocuments.every((docName) =>
            user.documents.some((document) => document.name === docName)
          );
      
          if (hasAllDocuments) {
            if (user.role === 'admin' || user.role === 'premium') {
              return false;
            }
      
            user.role = 'premium';
            await user.save();
            return true;
          } else {
            return false;
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
  
    async updateUserDocuments(userId, uploadedDocuments) {
      try {
        const user = await UserModel.findById(userId);
        if (!user) {
          console.error(`Usuario con ID "${userId}" no encontrado`);
          return null;
        }
    
        const currentDocuments = user.documents || [];
    
        for (const key in uploadedDocuments) {
          if (uploadedDocuments.hasOwnProperty(key)) {
            const document = uploadedDocuments[key];
            currentDocuments.push({
              name: key,
              reference: document,
            });
          }
        }  
        user.documents = currentDocuments;
        const userUpdated = await user.save();

        return userUpdated.toJSON();
      } catch (error) {
        console.error('Error al actualizar documentos del usuario:', error);
        return null;
      }
    }

}

export default UsersManager;