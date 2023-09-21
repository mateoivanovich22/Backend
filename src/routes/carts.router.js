import { Router } from "express";

import {create, getCartById, deleteProductOfCart, updateCart, updateProductOfCart, deleteAllProductsOfCart, finishBuying, deleteCart} from "../controllers/cart.controller.js";

import {notFoundURL} from "../utils.js"

const router = Router();

router.post("/", create);

router.get("/:cid", getCartById)

router.put("/:cid", updateCart)

router.delete("/:cid", deleteAllProductsOfCart)

router.delete("/:cid/products/:pid",deleteProductOfCart)

router.delete("/delete/:cid", deleteCart)

router.put("/:cid/products/:pid", updateProductOfCart)

router.post('/:cid/purchase', finishBuying)



router.all('*', notFoundURL)
export default router;
