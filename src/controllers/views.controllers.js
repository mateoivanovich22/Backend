import UserModel from "../dao/models/users.js";
import { createHash } from "../utils.js";

import CartsManagerMongoose from "../services/cartsManager.js";
const cartsManagerMongoose = new CartsManagerMongoose();

import ProductManagerMongoose from "../services/productManager.js";
const productManagerMongoose = new ProductManagerMongoose();

const logicaPostRecovery = async (email, password) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return "/recovery";
    } else {
      const passHash = createHash(password);
      user.password = passHash;
      await user.save();
      return "/login";
    }
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return "/register";
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
    console.error(error);
    throw new Error("Error interno del servidor");
  }
};

const logicaShowProductId = async (productId) => {
  try {
    const product = await productManagerMongoose.getProductById(productId);
    return product;
  } catch (error) {
    console.error(error);
    throw new Error("Error interno del servidor");
  }
};

const logicaRealTimeProducts = async () => {
  try {
    const products = await productManagerMongoose.getProducts();
    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Error interno del servidor");
  }
};

const logicaGetCartById = async (cartId) => {
  try {
    const cart = await cartsManagerMongoose.getCartWithProductsById(cartId);
    return cart;
  } catch (error) {
    console.error(error);
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