import * as logica from "../../controllers/carts.controllers.js";
import config from "../../config/config.js";
import log from "../../config/logger.js";
import nodemailer from 'nodemailer';

const nodemailerKey = config.nodemailer.key;

const create = async (req, res) => {
  const { product, quantity } = req.body;

  try {
    await logica.logicaCreateCart(product, quantity);

    res.status(200).send({
      message: "El carrito ha sido creado exitosamente.",
      data: {
        product,
        quantity,
      },
    });
  } catch (error) {
    log.error("Error al crear carrito:", error);
    res.status(500).send("Error al crear carrito");
  }
};

const getCartById = async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await logica.logicaGetCartById(cartId);
    res.send(cart);
  } catch (error) {
    log.error("Error al obtener el carrito:", error);
    res.status(500).send("Error al obtener el carrito");
  }
};

const deleteProductOfCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cartToDeleteProduct = await logica.logicaDeleteProductOfCart(
      cartId,
      productId
    );

    if (cartToDeleteProduct) {
      res.send({ status: "success" });
    } else {
      res.status(404).send({ error: "Producto o carrito no encontrado" });
    }
  } catch (error) {
    log.error("Error al eliminar el producto del carrito:", error);
    res.status(500).send("Error al eliminar el producto del carrito");
  }
};

const updateCart = async (req, res) => {
  const cartId = req.params.cid;
  const newProducts = req.body.products;

  try {
    const updatedCart = await logica.logicaUpdateCart(cartId, newProducts);
    res.status(200).send({
      message: "Carrito actualizado exitosamente.",
      data: updatedCart,
    });
  } catch (error) {
    if (error.message === "Carrito no encontrado.") {
      log.error("Carrito no encontrado.");
      res.status(404).send({ message: error.message });
    } else {
      log.error("Error al actualizar el carrito:", error);
      res.status(500).send("Error al actualizar el carrito.");
    }
  }
};

const updateProductOfCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    await logica.logicaUpdateProductOfCart(cartId, productId, quantity);
    res.status(200).send({ message: "Cantidad del producto actualizada correctamente." });
  } catch (error) {
    if (error.message === "La variable 'quantity' debe ser un número entero mayor a cero.") {
      log.error("La variable 'quantity' debe ser un número entero mayor a cero.");
      return res.status(400).send({ message: error.message });
    } else if (error.message === "El producto no se encuentra en el carrito.") {
      log.error("El producto no se encuentra en el carrito.");
      return res.status(404).send({ message: error.message });
    } else {
      log.error("Error al actualizar la cantidad del producto:", error);
      return res.status(500).send("Error al actualizar la cantidad del producto");
    }
  }
};

const deleteAllProductsOfCart = async (req, res) => {
  const cartId = req.params.cid;

  try {
    await logica.logicaDeleteAllProductsOfCart(cartId);
    res.send({ status: "success" });
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      log.error("Carrito no encontrado.");
      return res.status(404).send({ error: error.message });
    } else {
      log.error("Error eliminando los productos:", error);
      return res.status(500).send("Error al eliminar los productos del carrito");
    }
  }
};

const finishBuying = async (req, res) => {
  const cartId = req.params.cid;
  if (!req.session.user.email){
    res.status(500).send({ status: "No hay EMAIL y no se puede finalizar la compra" });
    return 
  }
  const email = req.session.user.email;
  
  try {
    const ticket = await logica.logicaFinishBuying(cartId, email);
    if (ticket) {
      res.send({ status: "success" });
    } else {
      res.send({ status: "error" });
    }

  } catch (error) {
    log.error("Error al finalizar la compra:", error);
    return res.status(500).send("Error al eliminar los productos del carrito");
  }
};

const showTicket = async (req, res) => {

  const userEmail = req.session.user.email;

  try {
    const tickets = await logica.logicaShowTicket(userEmail);

    const ticketDetails = tickets.map((ticket) => `
      <div>
        <strong>Código:</strong> ${ticket.code}<br>
        <strong>Fecha de Compra:</strong> ${ticket.purchase_datetime}<br>
        <strong>Monto:</strong> ${ticket.amount}<br>
        <strong>Comprador:</strong> ${ticket.purchaser}<br>
      </div>
    `).join("<br>");

    const html = `<h1>Muchas gracias por su compra, le dejamos los datos de sus compras: ${ticketDetails}</h1>`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mateoivanovichichi@gmail.com',
        pass: nodemailerKey
      }
    });

    const mailOptions = {
      from: 'mateoivanovichichi@gmail.com',
      to: userEmail,
      subject: 'Ticket emitido',
      html: html,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        log.error("Error al enviar el correo:", err);
        return;
      }

      log.info(`Mensaje enviado con éxito a ${userEmail}`);
    });

    if (tickets) {
      res.render('tickets', { tickets });
    } else {
      log.error("Hubo un error al mostrar el ticket");
    }
  } catch (error) {
    log.error('Error al buscar el ticket:', error);
  }
};


export {
  create,
  getCartById,
  deleteProductOfCart,
  updateCart,
  updateProductOfCart,
  deleteAllProductsOfCart,
  finishBuying,
  showTicket
}