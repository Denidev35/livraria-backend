import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";

import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import bookRoutes from './routes/books';
import salesRoutes from './routes/sales';
import fastifyCors from '@fastify/cors';

const app = Fastify({ logger: true });

app.register(fastifyCors, {
  origin: '*',
});

// Registra o plugin de JWT
app.register(fastifyJwt, {
  secret: 'seuSegredoJWTseguro'
});

// Agora, registre suas rotas
app.register(userRoutes, { prefix: '/users' });
app.register(authRoutes);
app.register(bookRoutes, { prefix: '/books' });
app.register(salesRoutes, { prefix: '/sales' });

app.listen({ port: 3333 })
  .then(() => {
    console.log('🚀 Servidor rodando em http://localhost:3333');
  })
  .catch(err => {
    app.log.error(err);
    process.exit(1);
  });
