import { FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma/client';

export function getBooks(fastify: FastifyInstance) {
  return async () => {
    return prisma.book.findMany();
  };
}

const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
  price: z.number(),
  stock: z.number(),
  isbn: z.string(),
});

export function createBook(fastify: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = bookSchema.parse(request.body);

      if (data.isbn.length !== 13) {
        reply.code(400);
        return { error: 'ISBN inválido' };
      }

      const bookExists = await prisma.book.findUnique({ where: { isbn: data.isbn } });
      if (bookExists) {
        reply.code(400);
        return { error: 'Livro ja cadastrado' };
      }

      const book = await prisma.book.create({ data });
      reply.code(201);
      return book;
    } catch (error) {
      reply.code(400);
      return { error: 'Dados inválidos' };
    }

  };
}

export function updateBook(fastify: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    const data = bookSchema.parse(request.body);
    const updated = await prisma.book.update({
      where: { id },
      data,
    });
    return updated;
  };
}

export function deleteBook(fastify: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    await prisma.book.delete({ where: { id } });
    return { success: true };
  };
}