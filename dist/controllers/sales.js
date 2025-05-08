"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSales = getSales;
exports.createSale = createSale;
const zod_1 = require("zod");
const client_1 = require("../prisma/client");
function getSales(request, reply) {
    return client_1.prisma.sale.findMany({ include: { book: true, user: true } });
}
const saleSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    bookId: zod_1.z.string(),
    quantity: zod_1.z.number().min(1)
});
async function createSale(request, reply) {
    const { userId, bookId, quantity } = saleSchema.parse(request.body);
    const book = await client_1.prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.stock < quantity) {
        reply.code(400);
        return { error: 'Livro não disponível em estoque suficiente.' };
    }
    const total = book.price * quantity;
    const sale = await client_1.prisma.sale.create({
        data: { userId, bookId, quantity, total },
    });
    await client_1.prisma.book.update({
        where: { id: bookId },
        data: { stock: book.stock - quantity },
    });
    reply.code(201);
    return sale;
}
