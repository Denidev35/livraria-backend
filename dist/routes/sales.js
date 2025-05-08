"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const sales_1 = require("../controllers/sales");
const verify_jwt_1 = require("middlewares/verify-jwt");
async function default_1(fastify) {
    fastify.addHook('onRequest', verify_jwt_1.verifyJWT);
    fastify.get('/', sales_1.getSales);
    fastify.post('/', sales_1.createSale);
}
