import { FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from 'prisma/client';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export function createUser(fastify: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password, name } = userSchema.parse(request.body);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      reply.code(400);
      return { error: 'User already exists' };
    }

    const hashed = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });
    reply.code(201);
    return user;
  };
}

export function listUsers(fastify: FastifyInstance) {
  return async () => {
    return await prisma.user.findMany();
  };
}
