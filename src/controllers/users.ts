import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from 'prisma/client';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
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
}

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return users;
}

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.sub;

  if (!userId) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  return reply.send(user);
}
