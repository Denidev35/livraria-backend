import { FastifyInstance } from 'fastify';
import { createUser, listUsers } from '../controllers/users';

export default async function (fastify: FastifyInstance) {
  fastify.post('/', createUser(fastify));
  fastify.get('/', listUsers(fastify));
}
