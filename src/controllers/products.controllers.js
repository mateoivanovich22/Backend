import ProductManager from "../services/productManager.js";
import log from "../config/logger.js";

const productManagerMongo = new ProductManager();

const logicaShowProducts = async (limit, page, sort, query) => {
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

    return products;
  } catch (error) {
    log.error(error);
    return false;
  }
};

const logicaCreateProduct = async (title, description, code, price, status, stock, category, thumbnails) => {
  try {
    if (!title || !description || !code || !price || !stock || !category) {
      return false;
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
    };

    await productManagerMongo.createProduct(product);

    return true;
  } catch (error) {
    log.error("Error al crear el producto:", error);
    return false;
  }
};

const logicaUpdateProduct = async (productIdParam, fieldsToUpdate) => {
  try {
    const product = await productManagerMongo.getProductById(productIdParam);

    if (!product) {
      return false;
    }

    const validParams = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnails",
    ];

    const isValidParams = Object.keys(fieldsToUpdate).every((param) =>
      validParams.includes(param)
    );

    if (!isValidParams) {
      return false;
    }

    await productManagerMongo.updateProduct(productIdParam, fieldsToUpdate);

    log.info("Producto modificado correctamente");
    return true;
  } catch (error) {
    log.error("Error al actualizar el producto:", error);
    return false;
  }
};

const logicaDeleteProduct = async(productId) => {
  const productDeleted = await productManagerMongo.deleteProduct(productId);

  return !!productDeleted;
};


export { logicaShowProducts, logicaCreateProduct, logicaUpdateProduct,logicaDeleteProduct };