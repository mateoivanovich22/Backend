import ProductManagerMongo from "../../services/productManager.js";
import * as logica from "../../controllers/products.controllers.js";
import log from "../../config/logger.js";

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
        user: user,
        welcomeMessage: welcomeMessage,
      });
    } catch (error) {
      log.error("Error al mostrar los productos:", error);
      res.status(500).send("Error interno del servidor");
    }
  } else {
    res.redirect("/login");
  }
};

const getProductById = async (req, res) => {
  const id = req.params.pid;
  try {
    const product = await productManagerMongo.getProductById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    log.error("Error al obtener el producto por ID:", error);
    res.status(500).send("Error interno del servidor");
  }
};

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
    owner
  } = req.body;

  try {
    
    const logicaCreate = await logica.logicaCreateProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      owner
    );
    if (logicaCreate) {
      res.status(200).send({ status: "success" });
    } else {
      log.error("Todos los campos son obligatorios");
      res.status(400).send("Todos los campos son obligatorios");
    }
  } catch (error) {
    log.error(error);
    res.status(500).send({error: error});
  }
  
};

const getCreateProduct = (req,res) => {
  const user = req.session.user;
  res.render('createProduct', {user})
}

const updateProduct = async (req, res) => {
  const productIdParam = req.params.pid;
  const fieldsToUpdate = req.body;

  try {
    const logicaUpdate = await logica.logicaUpdateProduct(
      productIdParam,
      fieldsToUpdate
    );

    if (logicaUpdate) {
      res.status(200).send({
        status: "success",
      });
    } else {
      log.error("Producto no encontrado o parámetro inválido");
      res.status(404).send("Producto no encontrado o parámetro inválido");
    }
  } catch (error) {
    log.error(error);
    res.status(500).send({ error: error });
  }
  
};

const deleteProduct = async (req, res) => {
  const productId = req.params.pid;
  const user= req.session.user;
  try {

    const product = await productManagerMongo.getProductById(productId);
    if( product ){
      const logicaDelete = await logica.logicaDeleteProduct(productId, user.role, product.owner);

      if (logicaDelete) {
        res.status(200).send({ status: "success" });
      } else {
        log.error("Producto no encontrado");
        res.status(400).send({ error: "Producto no encontrado" });
      }
    }else{
      log.error("Producto no encontrado");
      res.status(400).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    log.error(error);
    res.status(500).send({error: error});
  }
  
};



export {
    showProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCreateProduct
}