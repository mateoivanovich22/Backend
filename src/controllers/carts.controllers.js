import CartManager from "../services/cartsManager.js";
const cartsManager = new CartManager();

import log from "../config/logger.js"

const logicaCreateCart = async (product, quantity) => {
  const newCart = {
    products: [
      {
        product,
        quantity,
      },
    ],
  };

  try {
    await cartsManager.createCart(newCart);
  } catch (error) {
    log.error("Error al crear carrito:", error);
    throw new Error("Error al crear carrito");
  }
};

const logicaGetCartById = async (cartId) => {
  try {
    const cart = await cartsManager.getCartWithProductsById(cartId);
    return cart;
  } catch (error) {
    log.error("Error al obtener el carrito:", error);
    throw new Error("Error al obtener el carrito");
  }
};

const logicaDeleteProductOfCart = async (cartId, productId) => {
  try {
    const cartToDeleteProduct = await cartsManager.deleteProductOfCart(
      cartId,
      productId
    );
    return cartToDeleteProduct;
  } catch (error) {
    log.error("Error borrando el producto:", error);
    throw new Error("Error al borrar el producto del carrito");
  }
};

const logicaUpdateCart = async (cartId, newProducts) => {
  try {
    const updatedCart = await cartsManager.updateCart(cartId, newProducts);
    return updatedCart;
  } catch (error) {
    if (error.message === "Carrito no encontrado.") {
      throw new Error(error.message);
    } else {
      log.error("Error al actualizar el carrito:", error);
      throw new Error("Error al actualizar el carrito.");
    }
  }
};
const logicaUpdateProductOfCart = async (cartId, productId, quantity) => {
  try {
    await cartsManager.updateProductQuantityInCart(cartId, productId, quantity);
  } catch (error) {
    if (error.message === "La variable 'quantity' debe ser un número entero mayor a cero.") {
      throw new Error(error.message);
    } else if (error.message === "El producto no se encuentra en el carrito.") {
      throw new Error(error.message);
    } else {
      log.error("Error al actualizar la cantidad del producto:", error);
      throw new Error("Error al actualizar la cantidad del producto");
    }
  }
};

const logicaDeleteAllProductsOfCart = async (cartId) => {
  try {
    const deleted = await cartsManager.deleteAllProductOfCart(cartId);
    if (!deleted) {
      throw new Error("Carrito no encontrado");
    }
  } catch (error) {
    log.error("Error eliminando los productos:", error);
    throw new Error("Error al eliminar los productos del carrito");
  }
};

const logicaFinishBuying = async (cartId, purchaserEmail) => {
  const cart = await cartsManager.getCartWithProductsById(cartId);
  if (!cart) {
    return false;
  }

  const productsNotProcessed = await cartsManager.processProductsInCart(cart);

  if (productsNotProcessed.length === 0) {
    const totalPrice = await cartsManager.calculateTotalPrice(cart);
    const randomCode = await cartsManager.generateTicketCode();

    const ticketData = {
      code: randomCode,
      purchase_datetime: new Date(),
      amount: totalPrice,
      purchaser: purchaserEmail,
    };

    const isTicketCreated = await cartsManager.createTicket(ticketData);
    if (isTicketCreated) {
      const newCartProducts = cart.products.filter((product) => !productsNotProcessed.includes(product.product));
      await cartsManager.updateCart(cartId, newCartProducts);
      return true;
    } else {
      log.error('Error al crear el ticket.');
      return false;
    }
  } else {
    log.info("NOS QUEDAMOS SIN STOCK DE ESTE O ESTOS PRODUCTOS:", productsNotProcessed);
    return false;
  }
};

const logicaShowTicket = async( email ) => {
  try {
    const tickets = await cartsManager.findTicketsByEmail(email);
    return tickets
  } catch (error) {
    log.error('Error al buscar el ticket:', error);
    return false
  }
}

export {
  logicaCreateCart,
  logicaGetCartById,
  logicaDeleteProductOfCart,
  logicaUpdateCart,
  logicaUpdateProductOfCart,
  logicaDeleteAllProductsOfCart,
  logicaFinishBuying,
  logicaShowTicket
};