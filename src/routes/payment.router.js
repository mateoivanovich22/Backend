import express from "express";
import { cancelOrderStripe, captureOrderStripe, createOrderStripe } from "../controllers/stripe.controller.js";

const router = express.Router();

router.post('/create-order-stripe', createOrderStripe)
router.get('/capture-order-stripe', captureOrderStripe)
router.get('/cancel-order-stripe', cancelOrderStripe)

export default router;