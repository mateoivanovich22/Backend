const socket = io();

function addToCart(productId,productName, userId) {
  if(userId === '') {
    userId = req.session.user
  }

  try {
    socket.emit("cartCreated",  productId, productName, userId);

    socket.on("cartId", (cartId) => {
      window.location.href = `/carts/${cartId}`;
    });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
  }
}