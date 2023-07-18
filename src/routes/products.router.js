import { Router } from "express";

import { showProducts, createProduct, updateProduct, deleteProduct } from "../dao/operaciones/operacionesProducts.js";


const router = Router();

router.get("/", showProducts);

router.post("/", createProduct)

router.put("/:pid",updateProduct)

router.delete("/:pid", deleteProduct)

export default router;


/*
{
    "title": "selva",
    "price": 34,
    "code": 344,
    "description": "feas",
    "category": "galles",
    "stock": 22
}
*/