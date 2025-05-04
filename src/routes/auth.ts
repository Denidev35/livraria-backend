import { FastifyInstance } from 'fastify';
import { login } from '../controllers/auth';

export default async function (fastify: FastifyInstance) {
  fastify.post('/login', login(fastify));
}
