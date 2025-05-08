"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const users_1 = require("../controllers/users");
async function default_1(fastify) {
    fastify.post('/', users_1.createUser);
    fastify.get('/', users_1.listUsers);
    fastify.get('/me', users_1.getMe);
}
