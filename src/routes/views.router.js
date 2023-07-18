import express from "express";
import { passportCall } from "../utils.js";
import * as operations from "../dao/operaciones/operacionesViews.js";

const router = express.Router();

router.get("/current", passportCall("jwt"), operations.currentJWT);

router.get("/", operations.publicRoute, operations.showRegister);

router.post("/register", passportCall("register"), operations.postRegister);

router.get("/login", operations.publicRoute, operations.showLogin);

router.post("/login", passportCall("login"), operations.postLogin);

router.get("/login/github", operations.publicRoute, passportCall("github"));

router.get(
  "/login/github/callback",
  passportCall("github"),
  operations.githubCallback
);

router.get("/logout", operations.logout);

router.get("/recovery", operations.publicRoute, operations.recovery);

router.post("/recovery", operations.publicRoute, operations.postRecovery);

router.get("/realTimeProducts", operations.realTimeProducts);

router.get("/chat", operations.showChat);

router.get("/products", operations.showProductList);

router.get("/products/:id", operations.showProductId);

router.get("/carts/:cid", operations.showCartId);

export default router;
