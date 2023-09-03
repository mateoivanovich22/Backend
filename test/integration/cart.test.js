import { expect } from "chai";
import request from "supertest";
import supertestSession from "supertest-session"; 
import { cart1, newProduct, quantityUpdate } from "../mocks/carts.mock.js";

const app = "http://localhost:8080";

const requester = request(app)

const sessionInstance = supertestSession(app);

let cartCreatedId = 0;

let productOfCartId = 0;

describe("Carts Router Integration Tests", () => {

    it("should create a cart", async () => {
        const cart = cart1
        const response = await sessionInstance.post('/api/carts/').send(cart);

        cartCreatedId = response.body.cartId;
        productOfCartId = response.body.productId;
    
        expect(response.body.message).to.equal("El carrito ha sido creado exitosamente.");
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.be.true;
    });

    it("should search a cart", async () => {
        const response = await sessionInstance.get(`/api/carts/${cartCreatedId}`).send();

        expect(response.body._id).to.equal(cartCreatedId);
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.be.true;
    });

    it('should update a cart ', async () => {
        const response = await sessionInstance.put(`/api/carts/${cartCreatedId}`).send(newProduct);

        expect(response.body.message).to.equal("Carrito actualizado exitosamente.");
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.be.true;

    })

    it("should update a product of the cart ", async () => {
        const response = await sessionInstance.put(`/api/carts/${cartCreatedId}/products/${productOfCartId}`).send(quantityUpdate);
 
        expect(response.body.message).to.equal("Cantidad del producto actualizada correctamente.");
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.be.true;

    });

    it("should purchase a cart" , async () => {
        await sessionInstance.post("/login").send({ email: "mateo@gmail.com", password: "123" });

        const response = await sessionInstance.post(`/api/carts/${cartCreatedId}/purchase`).send();

        expect(response.body.status).to.equal("success");
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.be.true;

    })

    it("should delete a product of the cart ", async () => {
        const response = await sessionInstance.delete(`/api/carts/${cartCreatedId}/products/${productOfCartId}`)
 
        expect(response.body.status).to.equal("success");
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.be.true;

    });

    it("should delete all products of cart ", async () => {
        const response = await sessionInstance.delete(`/api/carts/${cartCreatedId}`)

        expect(response.body.status).to.equal("success");
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.be.true;

    });

    it("should delete a cart ", async ()=> {
        const response = await sessionInstance.delete(`/api/carts/delete/${cartCreatedId}`)

        expect(response.body.status).to.equal("success");
        expect(response.statusCode).to.equal(200);
        expect(response.ok).to.be.true;

    })

});
