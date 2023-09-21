
const socket = io();

function json_stringify(value) {
    return JSON.stringify(value);
}

async function borrarProduct(cartId, productId, productQuantity){
    socket.emit("borrarProduct", cartId, productId)
    
    return 
}

async function borrarAllProducts( cartId){
    socket.emit("borrarAllProducts", cartId)

}

socket.on("Todos los productos eliminados correctamente", () => {
    window.location.reload();
});

function seguirComprando(){
    window.location.href = '/api/products';
}

async function terminarCompra(cartId,totalPrice) {
    try {
        const option = "Compra mateomarket"
        const response = await fetch("/api/payment/create-order-stripe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ totalPrice, option, cartId }),
        })
        
        const data = await response.json()
        
        window.location.href = data.url
    } catch (error) {
        console.error('Error al realizar la compra:', error);
        throw new Error(error) 
    }
}

