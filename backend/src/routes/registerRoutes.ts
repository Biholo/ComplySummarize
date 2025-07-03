import { FastifyInstance } from "fastify";
import { authRoutes } from "./authRoutes";
import { documentRoutes } from "./documentRoutes";
import { userRoutes } from "./userRoutes";
import { applicationParameterRoutes } from "./applicationParameterRoutes";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(userRoutes, { prefix: '/api/users' });
    app.register(documentRoutes, { prefix: '/api/documents' });
    app.register(applicationParameterRoutes, { prefix: '/api/application-parameters' });
}

