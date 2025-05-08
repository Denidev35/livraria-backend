import { FastifyInstance } from 'fastify';
import { createUser, getMe, listUsers } from '../controllers/users';
import { verifyJWT } from 'middlewares/verify-jwt';

export default async function (fastify: FastifyInstance) {

  fastify.post('/', createUser);
  fastify.get('/', listUsers);
  fastify.get('/me', getMe);
}
