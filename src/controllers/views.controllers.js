import UserModel from "../dao/models/users.js";
import { createHash } from "../utils.js";
import log from "../config/logger.js";

import CartsManager from "../services/cartsManager.js";
const cartsManagerMongoose = new CartsManager();

import ProductManager from "../services/productManager.js";
const productManagerMongoose = new ProductManager();


const logicaPostRecovery = async (email) => {
  try {
    const user = await UserModel.findOne({ email });
    if (user && user.password === password) {
      return false
    }
    return true
  } catch (error) {
    log.error("Error al restablecer la contraseña:", error);
    return false;
  }
};

const logicaShowProductList = async (page, limit) => {
  try {
    const products = await productManagerMongoose.getPaginatedProducts(
      page,
      limit
    );
    return products;
  } catch (error) {
    log.error(error);
    throw new Error("Error interno del servidor");
  }
};

const logicaShowProductId = async (productId) => {
  try {
    const product = await productManagerMongoose.getProductById(productId);
    return product;
  } catch (error) {
    log.error(error);
    throw new Error("Error interno del servidor");
  }
};

const logicaRealTimeProducts = async () => {
  try {
    const products = await productManagerMongoose.getProducts();
    return products;
  } catch (error) {
    log.error(error);
    throw new Error("Error interno del servidor");
  }
};

const logicaGetCartById = async (cartId) => {
  try {
    const cart = await cartsManagerMongoose.getCartWithProductsById(cartId);
    return cart;
  } catch (error) {
    log.error(error);
    throw new Error("Error interno del servidor");
  }
};

export {
  logicaPostRecovery,
  logicaShowProductList,
  logicaShowProductId,
  logicaRealTimeProducts,
  logicaGetCartById
};