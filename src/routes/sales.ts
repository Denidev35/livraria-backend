import { FastifyInstance } from 'fastify';
import { getSales, createSale } from '../controllers/sales';
import { verifyJWT } from 'middlewares/verify-jwt';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', verifyJWT);

  fastify.get('/', getSales(fastify));
  fastify.post('/', createSale(fastify));
}