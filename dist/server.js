"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
require("dotenv/config");
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const books_1 = __importDefault(require("./routes/books"));
const sales_1 = __importDefault(require("./routes/sales"));
const cors_1 = __importDefault(require("@fastify/cors"));
const app = (0, fastify_1.default)({ logger: true });
app.register(cors_1.default, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
});
// Registra o plugin de JWT
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'secret',
});
// Agora, registre suas rotas
app.register(users_1.default, { prefix: '/users' });
app.register(auth_1.default);
app.register(books_1.default, { prefix: '/books' });
app.register(sales_1.default, { prefix: '/sales' });
app.listen({ port: 3333 })
    .then(() => {
    console.log('🚀 Servidor rodando em http://localhost:3333');
})
    .catch(err => {
    app.log.error(err);
    process.exit(1);
});
