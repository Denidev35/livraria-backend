import { FastifyPluginAsync } from 'fastify';
import { getBooks, createBook, updateBook, deleteBook, getBookId } from '../controllers/books';

import { verifyJWT } from '../middlewares/verify-jwt';

const bookRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', verifyJWT);

  fastify.get('/', getBooks);
  fastify.get('/:id', getBookId);
  fastify.post('/', createBook);
  fastify.put('/:id', updateBook);
  fastify.delete('/:id', deleteBook);
};

export default bookRoutes;
