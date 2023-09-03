import { expect } from "chai";
import request from "supertest";

const requester = request("http://localhost:8080");

describe("Login Integration Test", () => {
    it("should login successfully", async () => {
        const response = await requester.post("/login").send({ email: "mateo@gmail.com", password: "123" });

        expect(response.status).to.equal(302);
    });

});
