const socket = io();

function addToCart(productId,productName, userId, owner, userEmail) {

  try {
    const message = document.getElementById('cannotAdd');
    if(owner === userEmail) {
      message.style.display = 'block';
    }else{
      socket.emit("cartCreated",  productId, productName, userId);

      socket.on("cartId", (cartId) => {
      window.location.href = `/carts/${cartId}`;
    });
    }
    
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    throw new Error(error)
  }
}