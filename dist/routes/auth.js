"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const auth_1 = require("../controllers/auth");
async function default_1(fastify) {
    fastify.post('/login', auth_1.login);
}
