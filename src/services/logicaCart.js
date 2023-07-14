import CartManagerMongo from "../dao/controllers/cartsManager.js";
const cartsManager = new CartManagerMongo();

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
    console.error("Error al crear carrito:", error);
    throw new Error("Error al crear carrito");
  }
};

const logicaGetCartById = async (cartId) => {
  try {
    const cart = await cartsManager.getCartWithProductsById(cartId);
    return cart;
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
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
    console.error("Error borrando el producto:", error);
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
      console.error("Error al actualizar el carrito:", error);
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
      console.error("Error al actualizar la cantidad del producto:", error);
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
    console.error("Error eliminando los productos:", error);
    throw new Error("Error al eliminar los productos del carrito");
  }
};

export {
  logicaCreateCart,
  logicaGetCartById,
  logicaDeleteProductOfCart,
  logicaUpdateCart,
  logicaUpdateProductOfCart,
  logicaDeleteAllProductsOfCart
};
