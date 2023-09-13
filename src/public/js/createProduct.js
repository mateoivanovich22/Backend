const form = document.getElementById("product-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    let productData = {};
    formData.forEach((value, key) => {
        productData[key] = value;
    });

    try {
        const response = await fetch("/api/products/createProduct", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert("Producto creado exitosamente");
        } else {
            alert("Error al crear el producto");
        }
    } catch (error) {
        console.error("Error:", error);
    }

    form.reset();
});

function returnHome(){
    window.location.href = '/api/products';
}