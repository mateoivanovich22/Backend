
import { generateProducts } from "../mocks/generateProducts.js";
import customError from "../services/errors/customError.js";
import EErors from "../services/errors/enums.js";
import {
  generateCartError
} from "../services/errors/info.js";
import log from "../config/logger.js"; 

import CartsManager from "../services/cartsManager.js";
const cartsManagerMongoose = new CartsManager();

import ProductManager from "../services/productManager.js";
const productManagerMongoose = new ProductManager();

const realTimeProducts = async (req, res) => {
  try {
    const products = await productManagerMongoose.getProducts();
    const user = req.session.user;
    
    res.render("realTimeProducts", { products, user });
  } catch (error) {
    log.error(error);
    res.status(500).send("Error interno del servidor");
  }
};


const showChat = (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    log.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showProductList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const products = await productManagerMongoose.getPaginatedProducts(page, limit);
    res.render("productList", { products });
  } catch (error) {
    log.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showProductId = async (req, res) => {
  try {
    const user = req.session.user;
    const productId = req.params.id;
    const product = await productManagerMongoose.getProductById(productId);
    res.render("productDetails", { product, user });
  } catch (error) {
    log.error(error);
    res.status(500).send("Error interno del servidor");
  }
};


const showCartId = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsManagerMongoose.getCartWithProductsById(cartId);

    if (!cart) {
      return log.error("Carrito no encontrado", customError.createError({
        name: "Cart error",
        cause: generateCartError(cartId, cart),
        code: EErors.INVALID_PARAM,
      }));
    }

    const cartJSON = cart.toJSON();
    const totalPrice = await cartsManagerMongoose.calculateTotalPrice(cart)
    
    cartJSON.totalPrice = totalPrice;

    req.session.user.cart = cartId;
    res.render("cartDetails", { cart: cartJSON });
  } catch (error) {
    log.error(error);
    res.status(500).send("Error interno del servidor");
  }
};


const generateFakerProducts = (req, res) => {
  let products = [];

  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }

  res.status(200).send(products);
};


export {
  realTimeProducts,
  showChat,
  showProductList,
  showProductId,
  showCartId,
  generateFakerProducts,
};
