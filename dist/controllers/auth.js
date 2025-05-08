"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("../prisma/client");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
async function login(request, reply) {
    const { email, password } = loginSchema.parse(request.body);
    const user = await client_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        reply.code(401);
        return { message: 'User not found' };
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        reply.code(401);
        return { message: 'Invalid password' };
    }
    const token = await reply.jwtSign({}, {
        sign: { sub: user.id }
    });
    return reply.status(200).send({ token });
}
