import cartsModel from "../dao/models/carts.js";
import ProductManagerMongoose from "./productManager.js";
const productManagerMongoose = new ProductManagerMongoose();

class CartManager {
  constructor() {}

  async createCart(cart) {

    let result = await cartsModel.create(cart);
    return result;
  }

  async createCartWithProduct(productId){
    const product = await productManagerMongoose.getProductById(productId);
  
    if (!product) {
      return res.status(404).send("El producto no existe.");
    }
  
    const cart = {
      products: [
        {
          product: product.title,
          quantity: 1,
        },
      ],
    };
  
    const createdCart = await this.createCart(cart);
    console.log("Carrito creado:", createdCart);
  
    return createdCart;
  };

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
  
      console.log(`Producto con id ${productId} eliminado`, updatedCart);
      return true;
    } catch (error) {
      console.error("Error borrando el producto:", error);
    }
  }
}

export default CartManager;
