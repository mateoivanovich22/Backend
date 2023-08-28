const form = document.getElementById("product-form");
const userEmail = document.getElementById("userEmail").textContent; 
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    let productData = {};
    formData.forEach((value, key) => {
        productData[key] = value;
    });

    productData.owner = userEmail;

    try {
    const response = await fetch("/api/products", {
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
});