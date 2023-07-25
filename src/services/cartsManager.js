import cartsModel from "../dao/models/carts.js";
import ProductManagerMongoose from "./productManager.js";
const productManagerMongoose = new ProductManagerMongoose();
import mongoose from "mongoose"; 
import { Types } from "mongoose";
import UsersModel from "../dao/models/users.js";
const { ObjectId } = Types;

import  TicketModel  from '../dao/models/tickets.js';

class CartManager {
  constructor() {}

  async createCart(cart) {

    let result = await cartsModel.create(cart);
    return result;
  }

  async createCartWithProduct(productId, productName, userId) {

    if (!mongoose.isValidObjectId(productId)) {
      throw new Error("El ID del producto no es válido.");
    }

    const product = await productManagerMongoose.getProductById(productId);

    if (!product) {
      throw new Error("El producto no existe.");
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
      console.error("Error al obtener los usuarios:", error);
      throw error;
    }
  }

  async getCartWithProductsById(cartId) {
    try {
      const cart = await cartsModel.findById(cartId).populate("products");
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw new Error("Error al obtener el carrito");
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
        throw new Error("Carrito no encontrado.");
      }
  
      console.log("Carrito actualizado exitosamente");
      return updatedCart;
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw new Error("Error al actualizar el carrito");
    }
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("La variable 'quantity' debe ser un número entero mayor a cero.");
      }
  
      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cartId, "products._id": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      );
  
      if (!updatedCart) {
        throw new Error("El producto no se encuentra en el carrito.");
      }
  
      console.log("Cantidad del producto actualizada correctamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      throw new Error("Error al actualizar la cantidad del producto");
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
        console.log(`Carrito con id ${cartId} no encontrado`);
        return false;
      }
  
      console.log(`Carrito con id ${cartId} vaciado`);
      return true;
    } catch (error) {
      console.error("Error eliminando los productos:", error);
      throw new Error("Error al eliminar los productos del carrito");
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
        console.log(`Producto con id ${productId} no encontrado`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error borrando el producto:", error);
    }
  }

  async createTicket(ticketData) {
    try {
      const ticket = new TicketModel(ticketData);
      await ticket.save();
      return true;
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      return false;
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
            console.error('Error al actualizar el stock del producto:', error);
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
      console.error('Error al buscar los tickets:', error);
      throw new Error('Error al buscar los tickets');
    }
  }
  
}


export default CartManager;
