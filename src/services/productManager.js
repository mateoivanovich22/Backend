import productsModel from "../dao/models/products.js";
import { ObjectId } from 'mongoose';
import mongoose from "mongoose";
import customError from "./errors/customError.js";
import EErors from "./errors/enums.js";
import log from "../config/logger.js"

class ProductsManager {
  constructor() {}

  async createProduct(product) {
    let result = await productsModel.create(product);
    return result;
  }

  async getProducts() {
    try {
      const products = await productsModel.find({}).lean();
      return products;
    } catch (error) {
      return customError.createError({
        name: "Obtener products error block catch",
        cause: `Error al obtener los productos: ${error}`,
        message: "Invalid getProducts",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async getProductById(id) {
    try {
      const product = await productsModel.findById(new mongoose.Types.ObjectId(id)).lean();
      return product;
    } catch (error) {
      return customError.createError({
        name: "Obtener product error block catch",
        cause: `Error al obtener el producto: ${error}`,
        message: "Invalid getProductById",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async getProductByName(productName) {
    try {
      const product = await productsModel.findOne({ title: productName }).lean();
      return product;
    } catch (error) {
      return customError.createError({
        name: "Obtener product name error block catch",
        cause: `Error al obtener el producto por nombre: ${error}`,
        message: "Invalid getProductByName",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async getPaginatedProducts(page, limit) {
    try {
      const startIndex = (page - 1) * limit;

      const products = await productsModel.find({})
        .skip(startIndex)
        .limit(limit)
        .lean();

      return products;
    } catch (error) {
      return customError.createError({
        name: "Obtener paginate products error block catch",
        cause: `Error al obtener los productos paginados: ${error}`,
        message: "Invalid getPaginatedProducts",
        code: EErors.DATABASE_ERROR,
      });
    }
  }
  
  async updateProduct(id, fieldsToUpdate) {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true }).lean();
      return updatedProduct;
    } catch (error) {
      log.error(`Error modificando producto: ${error}`)
      return customError.createError({
        name: "Modificar product error block catch",
        cause: `Error modificando producto: ${error}`,
        message: "Invalid updateProduct",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async deleteProduct(id, role, owner) {
    try {
      const product = await productsModel.findById(id);
      let usuarioCreador = false;

      if(role === "premium" && product.owner === owner){
        usuarioCreador = true;
        log.info("Usuario premium autorizado a borrar su propio producto")     
      }

      if(role === "admin" || usuarioCreador){
        const deletedProduct = await productsModel.findByIdAndRemove(id).lean();
        if (!deletedProduct) {
          log.info(`Producto con id ${id} no encontrado`);
          return false;
        }
        return true;
      }else{
        log.info("Usted no puede eliminar el siguiente producto: " +  product.title);
        return false;
      }

    } catch (error) {

      log.error(`Error borrando el producto: ${error}`)

      return customError.createError({
        name: "Borrar product error block catch",
        cause: `Error borrando el producto: ${error}`,
        message: "Invalid deleteProduct",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async getPaginatedProductsWithOptions(filters, page, limit, sort) {
    try {
      const startIndex = (page - 1) * limit;

      const totalProducts = await productsModel.countDocuments(filters);
      const totalPages = Math.ceil(totalProducts / limit);

      const queryOptions = {
        skip: startIndex,
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
      return customError.createError({
        name: "Obtener paginate product error block catch",
        cause: `Error al obtener los productos paginados: ${error}`,
        message: "Invalid getPaginatedProductsWithOptions",
        code: EErors.DATABASE_ERROR,
      });
    }
  }

  async getPriceByName(name, quantity) {
    try {
      const product = await productsModel.findOne({ title: name }).lean();

      if (!product) {
        return customError.createError({
          name: "Obtener price product error",
          cause: `Producto con name: "${name}" no encontrado `,
          message: "Invalid getPriceByName",
          code: EErors.INVALID_PARAM,
        });
      }

      if (quantity <= 0) {
        return customError.createError({
          name: "La cantidad debe ser mayor a cero.",
          cause: `Producto con quantity: "${quantity}" `,
          message: "Invalid getPriceByName",
          code: EErors.INVALID_PARAM,
        });
      }

      const totalPrice = product.price * quantity;
      return totalPrice;
    } catch (error) {
      return customError.createError({
        name: "Error block catch.",
        cause: `Error: "${error}" `,
        message: "Invalid getPriceByName",
        code: EErors.INVALID_PARAM,
      });
    }
  }

}

export default ProductsManager;