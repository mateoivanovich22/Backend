
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

async function terminarCompra(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        window.location.href = '/tickets';
    } catch (error) {
        console.error('Error al realizar la compra:', error);
    }
}
