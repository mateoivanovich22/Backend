import { Router } from "express";

import {create, getCartById, deleteProductOfCart, updateCart, updateProductOfCart, deleteAllProductsOfCart, finishBuying, showTicket} from "../dao/operaciones/operacionesCart.js"

const router = Router();

router.post("/", create);

router.get("/:cid", getCartById)

router.delete("/:cid/products/:pid",deleteProductOfCart)

router.put("/:cid", updateCart)

router.put("/:cid/products/:pid", updateProductOfCart)

router.delete("/:cid", deleteAllProductsOfCart)

router.post('/:cid/purchase', finishBuying)
export default router;
