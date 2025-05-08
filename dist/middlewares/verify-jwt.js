"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
async function verifyJWT(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        return reply.status(401).send({ message: 'Unauthorized' });
    }
}
