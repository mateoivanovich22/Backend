import productsModel from "../dao/models/products.js";
import { ObjectId } from 'mongoose';
import mongoose from "mongoose";

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
      console.error("Error al obtener los usuarios:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await productsModel.findById(new mongoose.Types.ObjectId(id)).lean();
      return product;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      throw error;
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
      console.error("Error al obtener los productos paginados:", error);
      throw error;
    }
  }
  
  async updateProduct(id, fieldsToUpdate) {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true }).lean();
      console.log(`Producto con id ${id} modificado`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error("Error modificando producto:", error);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await productsModel.findByIdAndRemove(id).lean();
  
      if (!deletedProduct) {
        console.log(`Producto con id ${id} no encontrado`);
        return false;
      }
  
      console.log(`Producto con id ${id} eliminado`, deletedProduct);
      return true;
    } catch (error) {
      console.error("Error borrando el producto:", error);
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
      console.error("Error al obtener los productos paginados:", error);
      throw error;
    }
  }
}

export default ProductsManager;