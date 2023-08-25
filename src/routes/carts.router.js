import { Router } from "express";

import {create, getCartById, deleteProductOfCart, updateCart, updateProductOfCart, deleteAllProductsOfCart, finishBuying, showTicket} from "../dao/operaciones/operacionesCart.js"

import {notFoundURL} from "../utils.js"

const router = Router();

router.post("/", create);

router.get("/:cid", getCartById)

router.put("/:cid", updateCart)

router.delete("/:cid", deleteAllProductsOfCart)

router.delete("/:cid/products/:pid",deleteProductOfCart)

router.put("/:cid/products/:pid", updateProductOfCart)

router.post('/:cid/purchase', finishBuying)

router.all('*', notFoundURL)
export default router;
