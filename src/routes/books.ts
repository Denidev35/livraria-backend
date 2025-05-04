import { FastifyPluginAsync } from 'fastify';
import { getBooks, createBook, updateBook, deleteBook } from '../controllers/books';

import { verifyJWT } from '../middlewares/verify-jwt';

const bookRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', verifyJWT);

  fastify.get('/', getBooks(fastify));
  fastify.post('/', createBook(fastify));
  fastify.put('/:id', updateBook(fastify));
  fastify.delete('/:id', deleteBook(fastify));
};

export default bookRoutes;
