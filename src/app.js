import express from "express";
import { Server } from "socket.io";
import { engine } from 'express-handlebars';

import ProductManagerMongoose from "./dao/controllers/productManager.js";
import CartsManagerMongoose from "./dao/controllers/cartsManager.js";
import MessagesManager from "./dao/controllers/messagesManager.js";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import 'dotenv/config'
import config from "./config/config.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = config.server.port;

const app = express();
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
const io = new Server(server);

const productManagerMongoose = new ProductManagerMongoose();
const cartsManagerMongoose = new CartsManagerMongoose();
const messagesManager = new MessagesManager();

let productsOfMongoose = [];

app.use(
  session({
    secret: "s3cr3t3",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(__dirname + "/public"));
app.engine('handlebars', engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use(flash());

app.use("/api/products/", productsRouter);

app.use("/api/carts/", cartsRouter);

const getProducts = async () => {
  try {
    productsOfMongoose = await productManagerMongoose.getProducts();
    return productsOfMongoose;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return [];
  }
};

io.on("connection", async (socket) => {
  console.log("Connected to io server");

  await getProducts();
  socket.emit("products", productsOfMongoose);

  socket.on("messageCreated", async (message) => {
    await messagesManager.createMessage(message);
  });

  socket.on("cartCreated", async (productId) => {
    const newCart = await cartsManagerMongoose.createCartWithProduct(productId);
    socket.emit("cartId", newCart._id);
  });

  socket.on("productCreated", async (product) => {
    await productManagerMongoose.createProduct(product);
    await getProducts();
    io.emit("products", productsOfMongoose);
  });

  socket.on("deleteProduct", async (productId) => {
    await productManagerMongoose.deleteProduct(productId);
    await getProducts();
    io.emit("products", productsOfMongoose);
  });
});

app.use("/", viewsRouter);
export default app;