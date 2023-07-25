import { generateToken } from "../../utils.js";

import * as logica from "../../controllers/views.controllers.js";

const currentJWT = (req, res) => {
  if (req.session && req.session.user) {
    const currentUserDTO = {
      firstname: req.session.user.firstname,
      email: req.session.user.email,
      age: req.session.user.age,
      lastname: req.session.user.lastname,
      role: req.session.user.role

    };
    res.render("current", { user: currentUserDTO });
  } else {
    res.status(401).send("Usuario no autenticado");
  }
};

const showRegister = (req, res) => {
  res.render("register", { title: "Express" });
};

const postRegister = (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales incorrectas" });
  req.session.user = req.user;
  const token = generateToken(req.user);
  res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
  res.redirect("/products");
};

const showLogin = (req, res) => {
  res.render("login");
};

const postLogin = async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales incorrectas" });
  req.session.user = req.user;
  const token = generateToken(req.user);
  res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

  res.redirect("/api/products");
};

const githubCallback = (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales incorrectas" });
  }
  const token = generateToken(req.user);
  res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

  req.session.user = req.user;
  res.redirect("/api/products");
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

const recovery = (req, res) => {
  res.render("recovery");
};

const postRecovery = async (req, res) => {
  const { email, password } = req.body;

  try {
    const redirectUrl = await logica.logicaPostRecovery(email, password);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.redirect("/register");
  }
};

const realTimeProducts = async (req, res) => {
  try {
    const products = await logica.logicaRealTimeProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showChat = (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showProductList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const products = await logica.logicaShowProductList(page, limit);
    res.render("productList", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showProductId = async (req, res) => {
  try {
    const user = req.session.user
    const productId = req.params.id;
    const product = await logica.logicaShowProductId(productId);
    res.render("productDetails", { product, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showCartId = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await logica.logicaGetCartById(cartId);

    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }

    const cartJSON = cart.toJSON();

    res.render("cartDetails", { cart: cartJSON });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export {
  currentJWT,
  showRegister,
  postRegister,
  showLogin,
  postLogin,
  githubCallback,
  logout,
  recovery,
  postRecovery,
  realTimeProducts,
  showChat,
  showProductList,
  showProductId,
  showCartId
};