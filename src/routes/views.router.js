import express from "express";
import { notFoundURL, privateRoute, publicRoute } from "../utils.js";
import * as operations from "../controllers/views.controller.js";
const router = express.Router();

import { showTicket} from "../controllers/cart.controller.js";

import log from '../config/logger.js';

router.get("/", (req, res) => {
  res.redirect("/api/users/register")
});

router.get("/realTimeProducts", privateRoute ,operations.realTimeProducts);

router.get("/chat", publicRoute ,operations.showChat);

router.get("/products", operations.showProductList);

router.get("/products/:id" , operations.showProductId);

router.get("/carts/:cid", operations.showCartId);

router.get("/carts/", (req, res) => {
  res.render("noProducts")
})

router.get("/tickets", showTicket)

router.get('/mockingproducts', operations.generateFakerProducts);

router.get("/loggerTest", (req, res) => {
  log.debug("This is a debug log.");
  log.http("This is an http log.");
  log.info("This is an info log.");
  log.warning("This is a warning log.");
  log.error("This is an error log.");
  log.fatal("This is a fatal log.");

  res.send("Logger test complete.");
});


router.all('*', notFoundURL)



export default router;
