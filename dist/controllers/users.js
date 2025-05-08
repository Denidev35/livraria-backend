"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.listUsers = listUsers;
exports.getMe = getMe;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const client_1 = require("prisma/client");
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string(),
});
async function createUser(request, reply) {
    const { email, password, name } = userSchema.parse(request.body);
    const userExists = await client_1.prisma.user.findUnique({ where: { email } });
    if (userExists) {
        reply.code(400);
        return { error: 'User already exists' };
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await client_1.prisma.user.create({
        data: { email, password: hashed, name },
    });
    reply.code(201);
    return user;
}
async function listUsers(request, reply) {
    const users = await client_1.prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
        },
    });
    return users;
}
async function getMe(request, reply) {
    const userId = request.user?.sub;
    if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }
    const user = await client_1.prisma.user.findUnique({
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
