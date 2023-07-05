const { Router } = require("express");

const CartsManager = require("../dao/controllers/cartsManager.js")
const cartsManager = new CartsManager();

const router = Router();
 
router.post("/", async (req, res) => {
  const newCart = {
    products: [
      {
        product: req.body.product,
        quantity: req.body.quantity,
      },
    ],
  };
  
  try {
    await cartsManager.createCart(newCart);

    res.status(201).send({
      message: "El carrito ha sido creado exitosamente.",
      data: newCart,
    });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).send("Error al crear carrito");
  }
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartsManager.getCartWithProductsById(cartId);
    res.send(cart);
  } catch (error) {
    res.status(500).send("Error al obtener el carrito");
  }
});


router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cartToDeleteProduct = await cartsManager.deleteProductOfCart(cartId, productId);

  if (cartToDeleteProduct) {
    res.send({ status: "success" });
  } else {
    res.status(404).send({ error: "Producto o carrito no econtrado" });
  }
})

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const newProducts = req.body.products;

  try {
    const updatedCart = await cartsManager.updateCart(cartId, newProducts);
    res.status(200).send({
      message: "Carrito actualizado exitosamente.",
      data: updatedCart,
    });
  } catch (error) {
    if (error.message === "Carrito no encontrado.") {
      return res.status(404).send({ message: error.message });
    } else {
      console.error("Error al actualizar el carrito:", error);
      return res.status(500).send("Error al actualizar el carrito.");
    }
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    await cartsManager.updateProductQuantityInCart(cartId, productId, quantity);
    res.status(200).send({ message: "Cantidad del producto actualizada correctamente." });
  } catch (error) {
    if (error.message === "La variable 'quantity' debe ser un número entero mayor a cero.") {
      return res.status(400).send({ message: error.message });
    } else if (error.message === "El producto no se encuentra en el carrito.") {
      return res.status(404).send({ message: error.message });
    } else {
      console.error("Error al actualizar la cantidad del producto:", error);
      return res.status(500).send("Error al actualizar la cantidad del producto");
    }
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const deleted = await cartsManager.deleteAllProductOfCart(cartId);

    if (!deleted) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    res.send({ status: "success" });
  } catch (error) {
    console.error("Error eliminando los productos:", error);
    res.status(500).send("Error al eliminar los productos del carrito");
  }
}); 

module.exports = router;