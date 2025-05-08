import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from "../prisma/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginSchema.parse(request.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    reply.code(401);
    return { message: 'User not found' };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    reply.code(401);
    return { message: 'Invalid password' };
  }
  const token = await reply.jwtSign({}, {
    sign: { sub: user.id }
  });
  return reply.status(200).send({ token });
}