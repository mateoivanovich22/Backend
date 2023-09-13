import { expect } from "chai";
import request from "supertest";

import config from "../../src/config/config.js";

const app = config.server.host;

const requester = request(app);

describe("Login Integration Test", () => {
    it("should login successfully", async () => {
        const response = await requester.post("/api/users/login").send({ email: "mateo@gmail.com", password: "123" });

        expect(response.status).to.equal(302);
    });

});
