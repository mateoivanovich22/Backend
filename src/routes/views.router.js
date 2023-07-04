const express = require("express");

const ProductManagerMongoose = require("../dao/controllers/productManager.js");
const productManagerMongoose = new ProductManagerMongoose();

const CartManagerMongoose = require("../dao/controllers/cartsManager.js");
const cartsManagerMongoose = new CartManagerMongoose();

const router = express.Router();

const UserModel = require("../dao/models/users.js");
const { createHash } = require("../utils.js");
const passport = require("passport");

const privateRoute = (req, res, next) => {
  const user = req.session.user;
  if (user && user.role === "admin") {
    next();
  } else {
    res.redirect("/login");
  }
};

const publicRoute = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    res.redirect("/api/products");
  }
};

router.get("/", publicRoute, (req, res) => {
  res.render("register", { title: "Express" });
});

router.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get("/login", publicRoute, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales incorrectas" });
    req.session.user = req.user;
    res.redirect("/api/products");
  }
);

router.get("/login/github", publicRoute, passport.authenticate("github"));

router.get(
  "/login/github/callback",
  passport.authenticate("github"),
  (req, res) => {
    if (!req.user) {
      return res.status(400).send({ status: "error", error: "Credenciales incorrectas" });
    }
    req.session.user = req.user;
    res.redirect("/api/products");
  }
);

router.get("/profile", privateRoute, (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    const { firstname, lastname, email, age } = req.session.user;
    res.render("profile", { firstname, lastname, email, age });
  }
});

router.get("/logout", privateRoute, (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/recovery", publicRoute, (req, res) => {
  res.render("recovery");
});

router.post("/recovery", publicRoute, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.redirect("/recovery");
    } else {
      const passHash = createHash(password);
      user.password = passHash;
      await user.save();
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.redirect("/reset-password");
  }
});

router.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await productManagerMongoose.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/chat", (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/products", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const products = await productManagerMongoose.getPaginatedProducts(
      page,
      limit
    );
    res.render("productList", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productManagerMongoose.getProductById(productId);
    res.render("productDetails", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await cartsManagerMongoose.getCartWithProductsById(cartId);

    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }

    const cartJSON = cart.toJSON();

    res.render("cartDetails", { cart: cartJSON });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;
