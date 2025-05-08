import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma/client';

export function getSales(request: FastifyRequest, reply: FastifyReply) {
  return prisma.sale.findMany({ include: { book: true, user: true } });
}

const saleSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  quantity: z.number().min(1)
});

export async function createSale(request: FastifyRequest, reply: FastifyReply) {
  const { userId, bookId, quantity } = saleSchema.parse(request.body);
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || book.stock < quantity) {
    reply.code(400);
    return { error: 'Livro não disponível em estoque suficiente.' };
  }
  const total = book.price * quantity;
  const sale = await prisma.sale.create({
    data: { userId, bookId, quantity, total },
  });
  await prisma.book.update({
    where: { id: bookId },
    data: { stock: book.stock - quantity },
  });
  reply.code(201);
  return sale;
}