const socket = io();

const showProducts = (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  if (products && products.length > 0) {
    products.forEach((product) => {
      const productItem = document.createElement("li");
      productItem.productInfo = product;
      productItem.innerHTML = `
        <div>
          <strong>Title:</strong> ${product.title} <br>
          <strong>Price:</strong> $${product.price}<br>
          <strong>Stock:</strong> ${product.stock}<br>
          <strong>ID:</strong> ${product._id}<br>
        </div>
        <hr>
      `;
      productList.appendChild(productItem);
    });
  } else {
    productList.innerText = "No hay productos disponibles";
  }
  console.log("Lista de productos actualizada:", products);
};


socket.on("products", (products) => {
  showProducts(products);
});

const deleteProductForm = document.querySelector("#delete-product-form");
deleteProductForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const productId = document.querySelector("#product-id").value;
  socket.emit("deleteProduct", productId);
  document.querySelector("#product-id").value = "";
});


const form = document.getElementById("product-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const product = { 
    title, 
    price, 
    stock, 
    category, 
    description,
    code,
    thumbnail,
    status: true 
  };
  socket.emit("productCreated", product);
  form.reset();
});
