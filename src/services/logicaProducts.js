import ProductManagerMongo from "../dao/controllers/productManager.js";
import productsModel from "../dao/models/products.js";
const productManagerMongo = new ProductManagerMongo();

const logicaShowProducts = async (limit, page, sort, query) => {
  try {
    const filters = {};
    if (query) {
      filters.title = { $regex: query, $options: "i" };
    }

    const totalProducts = await productsModel.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);

    const queryOptions = {
      skip: (page - 1) * limit,
      limit: limit,
      sort: sort === "desc" ? { price: -1 } : { price: 1 },
    };

    const result = await productsModel.paginate(filters, queryOptions);
    result.prevLink = result.hasPrevPage
      ? `http://localhost:8080/students?page=${result.prevPage}`
      : "";
    result.nextLink = result.hasNextPage
      ? `http://localhost:8080/students?page=${result.nextPage}`
      : "";
    result.isValid = !(page <= 0 || page > result.totalPages);

    const products = await productsModel
      .find(filters, null, queryOptions)
      .lean();

    return products;
  } catch (error) {
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
    console.error("Error al crear el producto:", error);
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

    console.log("Producto modificado correctamente");
    return true;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return false;
  }
};

const logicaDeleteProduct = async(productId) => {
  const productDeleted = await productManagerMongo.deleteProduct(productId);

  return !!productDeleted;
}

export { logicaShowProducts, logicaCreateProduct, logicaUpdateProduct,logicaDeleteProduct };
