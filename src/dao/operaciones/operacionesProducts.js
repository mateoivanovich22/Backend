import ProductManagerMongo from "../../services/productManager.js";

import * as logica from "../../controllers/products.controllers.js"

const productManagerMongo = new ProductManagerMongo();


const showProducts = async (req, res) => {
  const user = req.session.user;
  if (user) {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || "";
    const query = req.query.query || "";

    const { firstname, lastname } = user;
    const welcomeMessage = `Bienvenido, ${firstname} ${lastname}!`;

    try {
      const products = await logica.logicaShowProducts(limit, page, sort, query);

      res.render("productList", {
        products: products,
        welcomeMessage: welcomeMessage,
      });
    } catch (error) {
      console.error("Error al mostrar los productos:", error);
      res.status(500).send("Error interno del servidor");
    }
  } else {
    res.redirect("/login");
  }
};



const getProductById = async (req, res) => {
    const id = req.params.pid;
    const product = await productManagerMongo.getProductById(id);
    if (product) {
      return res.send(product);
    } else {
      res.status(404).send("Producto no encontrado");
    }
}

const createProduct = async (req, res) => {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = req.body;

    const logicaCreate = await logica.logicaCreateProduct(title, description, code, price, status, stock, category,thumbnails)

    if (logicaCreate) {
      res.send({ status: "success" });
    }else{
        return res.status(400).send("Todos los campos son obligatorios");
    }
     
}

const updateProduct = async (req, res) => {
  const productIdParam = req.params.pid;

  const fieldsToUpdate = req.body;

  const logicaUpdate = await logica.logicaUpdateProduct(productIdParam, fieldsToUpdate)

  if(logicaUpdate){
      res.send({
        status: "success",
      });
  }else{
    res.status(404).send("Producto no encontrado o parametro invalido");
  }
  
}

const deleteProduct = async (req, res) => {
  const productId = req.params.pid;

  const logicaDelete = logica.logicaDeleteProduct( productId );	

  if (logicaDelete) {
    res.send({ status: "success" });
  } else {
    res.status(404).send({ error: "Producto no econtrado" });
  }
}


export {
    showProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}