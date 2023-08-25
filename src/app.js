import express from "express";
import { Server } from "socket.io";
import { engine } from 'express-handlebars';

import UsersManager from "./services/usersManager.js";
import ProductManagerMongoose from "./services/productManager.js";
import CartsManagerMongoose from "./services/cartsManager.js";
import MessagesManager from "./services/messagesManager.js"
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
import usersRouter from "./routes/users.router.js"

import compression from "express-compression";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import errorHandler from "./middlewares/error/info.js";

import log from "./config/logger.js"

import swaggerJsdoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = config.server.port;

const app = express();
app.use(compression());
app.use(errorHandler)

const server = app.listen(PORT, () => log.info(`Server is listening on port ${PORT}`));

const io = new Server(server);

const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Backend project',
          description: 'Pruebas en swagger coderhouse'
      }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const productManagerMongoose = new ProductManagerMongoose();
const cartsManagerMongoose = new CartsManagerMongoose();
const messagesManager = new MessagesManager();
const usersManager = new UsersManager();


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

app.use("/api/users/", usersRouter); 

const getProducts = async () => {
  
  try {
    productsOfMongoose = await productManagerMongoose.getProducts();
    return productsOfMongoose;
  } catch (error) {
    log.error("Error al obtener los productos:", error);
    return [];
  }
  
};

io.on("connection", async (socket) => {
  log.info("Connected to io server");

  await getProducts();
  socket.emit("products", productsOfMongoose);

  socket.on("messageCreated", async (message) => {
    await messagesManager.createMessage(message);
  });

  socket.on("cartCreated", async (productId, productName, userId) => {

    const newCart = await cartsManagerMongoose.createCartWithProduct(productId,productName,userId);
    socket.emit("cartId", newCart._id);
  });

  socket.on("productCreated", async (product) => {
    await productManagerMongoose.createProduct(product);
    await getProducts();
    io.emit("products", productsOfMongoose);
  });

  socket.on("borrarProduct", async (cartId, productId) => {
    const productBorrado = await cartsManagerMongoose.deleteProductOfCart(cartId, productId)
    if (productBorrado) {
      io.emit("Todos los productos eliminados correctamente");
    } else {
        io.emit("Error al eliminar todos los productos");
    }
  })

  socket.on("borrarAllProducts", async (cartId) => {
    try {
        const borrar = await cartsManagerMongoose.deleteAllProductOfCart(cartId);
        if (borrar) {
          io.emit("Todos los productos eliminados correctamente");
        } else {
          io.emit("Error al eliminar todos los productos");
        }
    } catch (error) {
        log.error('Error al eliminar todos los productos:', error);
        return
    }
  });

  socket.on("deleteProduct", async (productId, role, owner) => {
    await productManagerMongoose.deleteProduct(productId, role, owner);
    await getProducts();
    io.emit("products", productsOfMongoose);
  });

  socket.on('upgradeUser', async (id) => {
    try {
      const userUpgraded = await usersManager.upgradeUser(id);
      if(userUpgraded){
        log.info("User with id " + id + " has been upgraded");
        io.emit("user upgraded")
      }else{
        log.info("User with id " + id + " cannot be upgraded")
        io.emit("user upgraded false")
      }
      
    } catch (error) {
      log.error(error);
      return
    }
    
  })

  socket.on('darseDeBaja', async (id) => {
    try {
      const estadoBaja = await usersManager.estadoPremiumBaja(id);
      
      if(estadoBaja){
        log.info("User with id " + id + " has been downgraded");
        io.emit("user downgrade")
      }else{
        log.info("User with id " + id + " cannot be downgrade")
        
      }

    } catch (error) { 
      log.error(error);
      return
    }
  })
});

app.use("/", viewsRouter);
export default app;