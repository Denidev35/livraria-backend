import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma/client';

export function getBooks(request: FastifyRequest, reply: FastifyReply) {
  return prisma.book.findMany();
};

const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
  price: z.number(),
  stock: z.number(),
  isbn: z.string(),
});

export async function createBook(request: FastifyRequest, reply: FastifyReply) {
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

}

export async function updateBook(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }; // Garantir que o id seja do tipo correto
  try {
    const data = bookSchema.parse(request.body);

    // Verificar se o livro existe
    const bookExists = await prisma.book.findUnique({ where: { id } });
    if (!bookExists) {
      return reply.status(404).send({ error: 'Livro não encontrado' });
    }

    // Atualizar o livro
    const updated = await prisma.book.update({
      where: { id },
      data,
    });

    return updated;
  } catch (error) {
    if (error instanceof z.ZodError) { // Se for um erro de validação
      return reply.status(400).send({ error: 'Dados inválidos' });
    }
    // Tratar outros tipos de erro (como erro de banco de dados, por exemplo)
    console.error(error);
    return reply.status(500).send({ error: 'Erro ao atualizar livro' });
  }
}


export async function deleteBook(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await prisma.book.delete({ where: { id } });
  return { success: true };
}

export async function getBookId(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  return prisma.book.findUnique({ where: { id } });
} 