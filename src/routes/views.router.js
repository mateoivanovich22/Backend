import express from "express";
import { notFoundURL, passportCall, privateRoute, publicRoute } from "../utils.js";
import * as operations from "../dao/operaciones/operacionesViews.js";
const router = express.Router();

import { showTicket} from "../dao/operaciones/operacionesCart.js";

import log from '../config/logger.js';

router.get("/current", passportCall("jwt"), operations.currentJWT);

router.get("/", operations.showRegister);

router.post("/register", passportCall("register"), operations.postRegister);

router.get("/login", operations.showLogin);

router.post("/login", passportCall("login"), operations.postLogin);

router.get("/login/github", passportCall("github"));

router.get(
  "/login/github/callback",
  passportCall("github"),
  operations.githubCallback
);

router.get("/logout", operations.logout);

router.get("/recovery", operations.recovery);

router.post("/recovery", operations.postRecovery);

router.get("/realTimeProducts", privateRoute ,operations.realTimeProducts);

router.get("/chat", publicRoute ,operations.showChat);

router.get("/products", operations.showProductList);

router.get("/products/:id" , operations.showProductId);

router.get("/carts/:cid", operations.showCartId);

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
