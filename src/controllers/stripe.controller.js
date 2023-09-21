import Stripe from "stripe";
import  config  from "../config/config.js"

const secret_key_stripe= config.stripe.Secret_key
const stripe = new Stripe(secret_key_stripe)

const HOST = config.server.host

export const createOrderStripe = async(req,res) => {
    let { totalPrice } = req.body;

    const { cartId } = req.body;
    const { option } = req.body;

    totalPrice = parseFloat(totalPrice);

    const priceInCents = Math.round(totalPrice * 100);

    const session = await stripe.checkout.sessions.create({
        line_items: [ {
            price_data: {
                product_data: {
                    name: 'Mateo market',
                    description: option
                },
                currency: 'usd',
                unit_amount: priceInCents
            },
            quantity: 1
        }],
        mode: 'payment',
        success_url: `${HOST}/api/payment/capture-order-stripe`,
        cancel_url: `${HOST}/api/payment/cancel-order-stripe`
    })

    res.cookie('cartId', cartId, { maxAge: 900000, httpOnly: true });

    return res.json(session)
}

export const captureOrderStripe = async(req,res) => {

    const cartId = req.cookies.cartId;
    const email = req.session.user.email;
    
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })

    };
    const apiUrl = `${HOST}/api/carts/${cartId}/purchase`;

    const response = await fetch(apiUrl, requestOptions)

    if (!response.ok) {
        console.error("La respuesta del servidor no fue exitosa.");
        res.redirect("/error"); 
        return;
    }

    try {
        const data = await response.json();

    } catch (error) {
        console.error("Error al analizar la respuesta JSON:", error);
        res.redirect("/error"); 
    }

    res.redirect("/tickets")
}

export const cancelOrderStripe = (req,res) => {
    res.redirect("/")
}