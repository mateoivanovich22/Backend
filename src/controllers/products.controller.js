import ProductManagerMongo from "../services/productManager.js";
import log from "../config/logger.js";
import config from "../config/config.js";

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
      const filters = {};
      if (query) {
        filters.title = { $regex: query, $options: "i" };
      }

      const products = await productManagerMongo.getPaginatedProductsWithOptions(
        filters,
        page,
        limit,
        sort
      );

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
    res.redirect("/api/users/login");
  }
};


const getProductById = async (req, res) => {
  const id = req.params.pid;
  try {
    const product = await productManagerMongo.getProductById(id);
    if (product) {
      res.status(200).send(product);
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
    thumbnails = [],
    category,
  } = req.body;

  const owner = req.session.user.email

  try {
    if (!title || !description || !code || !price || !stock || !category || !owner) {
      log.error("Todos los campos son obligatorios");
      res.status(400).send("Todos los campos son obligatorios");
      return;
    }

    const product = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      owner
    };

    const productCreated = await productManagerMongo.createProduct(product);

    if (productCreated) {
      res.status(200).send({ status: "success", product: productCreated });
    } else {
      log.error("Error al crear el producto");
      res.status(500).send("Error al crear el producto");
    }
  } catch (error) {
    log.error(error);
    res.status(500).send({ error: error });
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
    const product = await productManagerMongo.getProductById(productIdParam);

    if (!product) {
      log.error("Producto no encontrado o parámetro inválido");
      res.status(404).send("Producto no encontrado o parámetro inválido");
      return;
    }

    const validParams = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnail",
    ];
    const isValidParams = Object.keys(fieldsToUpdate).every((param) =>
      validParams.includes(param)
    );

    if (!isValidParams) {
      log.info("Parámetros inválidos");
      res.status(400).send("Parámetros inválidos");
      return;
    }

    await productManagerMongo.updateProduct(productIdParam, fieldsToUpdate);

    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    log.error(error);
    res.status(500).send({ error: error });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.pid;
  const user = req.session.user;

  try {
    const product = await productManagerMongo.getProductById(productId);
    if (!product) {
      log.error("Producto no encontrado");
      res.status(400).send({ error: "Producto no encontrado" });
      return;
    }

    const productDeleted = await productManagerMongo.deleteProduct(productId, user.role, product.owner,user);

    if (productDeleted) {
      res.status(200).send({ status: "success" });
    } else {
      log.error("No tienes permisos para eliminar este producto");
      res.status(403).send({ error: "No tienes permisos para eliminar este producto" });
    }
  } catch (error) {
    log.error(error);
    res.status(500).send({ error: error });
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