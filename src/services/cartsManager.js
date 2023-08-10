import cartsModel from "../dao/models/carts.js";
import ProductManagerMongoose from "./productManager.js";
const productManagerMongoose = new ProductManagerMongoose();
import mongoose from "mongoose"; 
import { Types } from "mongoose";
import UsersModel from "../dao/models/users.js";
const { ObjectId } = Types;

import  TicketModel  from '../dao/models/tickets.js';

import customError from "./errors/customError.js";
import EErors from "./errors/enums.js";

import log from "../config/logger.js"

class CartManager {
  constructor() {}

  async createCart(cart) {

    let result = await cartsModel.create(cart);
    return result;
  }

  async createCartWithProduct(productId, productName, userId) {

    if (!mongoose.isValidObjectId(productId)) {
      return customError.createError({
        name: "Product ID Error",
        cause: "El ID del producto no es válido.",
        message: "Invalid Product ID",
        code: EErors.INVALID_PARAM,
      });
    }

    const product = await productManagerMongoose.getProductById(productId);

    if (!product) {
      return customError.createError({
        name: "Product Not Found Error",
        cause: "El producto no existe.",
        message: "Product Not Found",
        code: EErors.INVALID_PARAM,
      });
    }

    const user = await UsersModel.findById(userId).lean();

    if (user.cart) {
      const existingCart = await cartsModel.findById(user.cart).lean();

      const existingProductIndex = existingCart.products.findIndex(
        (item) => item.product === productName
      );

      if (existingProductIndex !== -1) {
        existingCart.products[existingProductIndex].quantity += 1;
      } else {
        existingCart.products.push({
          product: product.title,
          quantity: 1,
        });
      }

      const updatedCart = await cartsModel.findByIdAndUpdate(
        user.cart,
        { products: existingCart.products },
        { new: true }
      );

      return updatedCart;
    }

    const cart = {
      products: [
        {
          product: product.title,
          quantity: 1,
        },
      ],
    };

    const createdCart = await cartsModel.create(cart);
    await UsersModel.findByIdAndUpdate(userId, { cart: createdCart._id });
    return createdCart;
  }

  async getCarts() {
    try {
      const carts = await cartsModel.find({}).lean();
      return carts;
    } catch (error) {
      return customError.createError({
        name: "Get carts is not OK",
        cause: `This is the cause: ${error}`,
        message: "Carts Not Found",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async getCartWithProductsById(cartId) {
    try {
      const cart = await cartsModel.findById(cartId).populate("products");
      return cart;
    } catch (error) {
      return customError.createError({
        name: "Get this cart is not OK",
        cause: `This is the cause: ${error}`,
        message: "Cart Not Found",
        code: EErors.DATABASE_ERROR,
      });;
    }
  }

  async updateCart(cartId, newProducts) {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(
        cartId,
        { products: newProducts },
        { new: true }
      );
  
      if (!updatedCart) {
        return customError.createError({
          name: "Cart Not Found Error",
          cause: `Carrito con ID ${cartId} no encontrado.`,
          message: "Carrito no encontrado",
          code: EErors.INVALID_PARAM,
        });
      }
  
      log.info("Carrito actualizado exitosamente");
      return updatedCart;

    } catch (error) {

      return customError.createError({
        name: "Cart Update Error",
        cause: `Error al actualizar el carrito: ${error.message}`,
        message: "Error al actualizar el carrito",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return customError.createError({
          name: "Invalid Quantity Error",
          cause: "La variable 'quantity' debe ser un número entero mayor a cero.",
          message: "Cantidad inválida",
          code: EErors.INVALID_PARAM,
        });
      }
  
      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cartId, "products._id": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      );
  
      if (!updatedCart) {
        return customError.createError({
          name: "El producto no se encuentra en el carrito.",
          cause: `Este es el carrito: ${updatedCart}`,
          message: "Error al actualizar el producto del carrito",
          code: EErors.DATABASE_ERROR,
        });
      }
  
      log.info("Cantidad del producto actualizada correctamente");
      return true;
    } catch (error) {
      return customError.createError({
        name: "Product Quantity Update Error",
        cause: `Error al actualizar la cantidad del producto: ${error}`,
        message: "Error al actualizar la cantidad del producto",
        code: EErors.DATABASE_ERROR,
      });
    }
  }
  
  async deleteAllProductOfCart(cartId) {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(
        cartId,
        { $set: { products: [] } },
        { new: true }
      );
  
      if (!updatedCart) {
        log.info(`Carrito con id ${cartId} no encontrado`);
        return false;
      }
  
      log.info(`Carrito con id ${cartId} vaciado`);
      return true;
    } catch (error) {
      return customError.createError({
        name: "Error eliminando los productos",
        cause: `Error al eliminar todos los productos: ${error}`,
        message: "Error al eliminar todos los productos",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async deleteProductOfCart(cartId, productId) {
    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(
        new ObjectId(cartId),
        { $pull: { products: { _id: productId } } },
        { new: true }
      );
  
      if (!updatedCart) {
        log.info(`Producto con id ${productId} no encontrado`);
        return false;
      }
      return true;
    } catch (error) {
      return customError.createError({
        name: "Error eliminando el producto",
        cause: `Error borrando el producto: ${error}`,
        message: "Error al eliminar el producto",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async createTicket(ticketData) {
    try {
      const ticket = new TicketModel(ticketData);
      await ticket.save();
      return true;
    } catch (error) {
      return customError.createError({
        name: "Error creando ticket",
        cause: `Error al crear el ticket: ${error}`,
        message: "Error creando ticket",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async processProductsInCart(cart) {
    const productsNotProcessed = [];
  
    for (const product of cart.products) {
      const productInfo = await productManagerMongoose.getProductByName(product.product);
  
      if (!productInfo) {
        productsNotProcessed.push(product.product);
      } else if (product.quantity > productInfo.stock) {
        productsNotProcessed.push(product.product);
      } else {
        if (productInfo.stock >= 0 && product.quantity <= productInfo.stock) {
          productInfo.stock -= product.quantity;
          
          try {
            await productManagerMongoose.updateProduct(productInfo._id, { stock: productInfo.stock });
          } catch (error) {
            log.error('Error al actualizar el stock del producto:', error);
            productsNotProcessed.push(product.product);
          }
        } else {
          productsNotProcessed.push(product.product);
        }
      }
    }
  
    return productsNotProcessed;
  };

  async generateTicketCode() {
    const currentDate = new Date();
    const randomCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const year = currentDate.getFullYear().toString().substr(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
    const ticketCode = `${year}${month}${day}${hours}${minutes}${seconds}${randomCode}`;
    return ticketCode;
  }

  async  calculateTotalPrice(cart) {
    let totalPrice = 0;
  
    for (const product of cart.products) {
      const productPrice = await productManagerMongoose.getPriceByName(product.product, product.quantity);
      totalPrice += productPrice;
    }
  
    return totalPrice;
  }
  
  async findTicketsByEmail(email) {
    try {
      const tickets = await TicketModel.find({ purchaser: email }).lean();
      return tickets;
    } catch (error) {
      return customError.createError({
        name: "Error buscando ticket",
        cause: `Error al buscar los tickets: ${error}`,
        message: "Error buscando ticket",
        code: EErors.DATABASE_ERROR,
      });
    }
  }
  
}


export default CartManager;
