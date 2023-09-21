const socket = io();

const quantityInput = document.getElementById('quantity');

function addToCart(productId,productName, userId, owner, userEmail, quantityValue) {

  try {
    const message = document.getElementById('cannotAdd');
    const quantityValue = quantityInput.value;
    if(owner === userEmail) {
      message.style.display = 'block';
    }else{
      socket.emit("cartCreated",  productId, productName, userId, quantityValue);

      socket.on("cartId", (cartId) => {
      window.location.href = `/carts/${cartId}`;
    });
    }
    
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    throw new Error(error)
  }
}