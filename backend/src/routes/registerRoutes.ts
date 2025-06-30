import { FastifyInstance } from "fastify";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { documentRoutes } from "./documentRoutes";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(userRoutes, { prefix: '/api/users' });
    app.register(documentRoutes, { prefix: '/api/documents' });
}

