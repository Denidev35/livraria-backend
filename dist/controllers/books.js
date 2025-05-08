"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = getBooks;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
exports.getBookId = getBookId;
const zod_1 = require("zod");
const client_1 = require("../prisma/client");
function getBooks(request, reply) {
    return client_1.prisma.book.findMany();
}
;
const bookSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    price: zod_1.z.number(),
    stock: zod_1.z.number(),
    isbn: zod_1.z.string(),
});
async function createBook(request, reply) {
    try {
        const data = bookSchema.parse(request.body);
        if (data.isbn.length !== 13) {
            reply.code(400);
            return { error: 'ISBN inválido' };
        }
        const bookExists = await client_1.prisma.book.findUnique({ where: { isbn: data.isbn } });
        if (bookExists) {
            reply.code(400);
            return { error: 'Livro ja cadastrado' };
        }
        const book = await client_1.prisma.book.create({ data });
        reply.code(201);
        return book;
    }
    catch (error) {
        reply.code(400);
        return { error: 'Dados inválidos' };
    }
}
async function updateBook(request, reply) {
    const { id } = request.params; // Garantir que o id seja do tipo correto
    try {
        const data = bookSchema.parse(request.body);
        // Verificar se o livro existe
        const bookExists = await client_1.prisma.book.findUnique({ where: { id } });
        if (!bookExists) {
            return reply.status(404).send({ error: 'Livro não encontrado' });
        }
        // Atualizar o livro
        const updated = await client_1.prisma.book.update({
            where: { id },
            data,
        });
        return updated;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) { // Se for um erro de validação
            return reply.status(400).send({ error: 'Dados inválidos' });
        }
        // Tratar outros tipos de erro (como erro de banco de dados, por exemplo)
        console.error(error);
        return reply.status(500).send({ error: 'Erro ao atualizar livro' });
    }
}
async function deleteBook(request, reply) {
    const { id } = request.params;
    await client_1.prisma.book.delete({ where: { id } });
    return { success: true };
}
async function getBookId(request, reply) {
    const { id } = request.params;
    return client_1.prisma.book.findUnique({ where: { id } });
}
