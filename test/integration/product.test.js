import { expect } from "chai";
import { product1, productSinProperties,productUpdate } from "../mocks/products.mock.js";
import supertestSession from "supertest-session"; 

import config from "../../src/config/config.js";

const app = config.server.host;

const sessionInstance = supertestSession(app);

let productCreatedId = 0;

describe("Products Router Integration Tests", () => {

    it("should get a list of products after successful login", async () => {
        await sessionInstance.post("/api/users/login").send({ email: "mateo@gmail.com", password: "123" });

        const response = await sessionInstance.get('/api/products').send();

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.ok).to.be.true;
    });

    it("should create a new product after successful login", async () => {
        await sessionInstance.post("/api/users/login").send({ email: "mateo@gmail.com", password: "123" });

        const newProduct = product1;
        const response = await sessionInstance.post('/api/products').send(newProduct)
        productCreatedId = response.body.product._id;

        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an('object')
        expect(response.ok).to.be.true
    });
    
    it("should not create a new product after successful login", async () => {
        await sessionInstance.post("/api/users/login").send({ email: "mateo@gmail.com", password: "123" });

        const newProduct = productSinProperties;
        const response = await sessionInstance.post('/api/products').send(newProduct)
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('object')
        expect(response.ok).to.be.false;
    });

    it("should update an existing product after successful login", async () => {
        await sessionInstance.post("/api/users/login").send({ email: "mateo@gmail.com", password: "123" });

        const updatedProduct = productUpdate;
        const response = await sessionInstance.put(`/api/products/${productCreatedId}`).send(updatedProduct)
        expect(response.status).to.equal(200);
    });

    it("should delete an existing product after successful login", async () => {
        await sessionInstance.post("/api/users/login").send({ email: "mateo@gmail.com", password: "123" });

        const response = await sessionInstance.delete(`/api/products/${productCreatedId}`);

        expect(response.status).to.equal(200);
        expect(response.ok).to.be.true;
        
    });
});
