"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const books_1 = require("../controllers/books");
const verify_jwt_1 = require("../middlewares/verify-jwt");
const bookRoutes = async (fastify) => {
    fastify.addHook('onRequest', verify_jwt_1.verifyJWT);
    fastify.get('/', books_1.getBooks);
    fastify.get('/:id', books_1.getBookId);
    fastify.post('/', books_1.createBook);
    fastify.put('/:id', books_1.updateBook);
    fastify.delete('/:id', books_1.deleteBook);
};
exports.default = bookRoutes;
