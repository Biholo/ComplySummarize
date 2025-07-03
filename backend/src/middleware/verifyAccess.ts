import { forbiddenResponse, unauthorizedResponse } from '@/utils/jsonResponse';

import { BasicUserDto } from '@shared/dto';
import { Role } from '@shared/enums';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

interface AuthenticatedRequest extends FastifyRequest {
    user: BasicUserDto;
}

/**
 * Middleware to check if the user has the required access rights, considering the role hierarchy.
 * @param requiredRole - The required role to access the resource.
 */
export const verifyAccess = (requiredRole: Role) => {
    return (req: AuthenticatedRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
        const user = req.user;

        if (!user) {
            return unauthorizedResponse(reply, 'Unauthorized: User not authenticated.');
        }

        const hasAccess = user.roles?.includes(requiredRole);

        if (hasAccess) {
            done();
            return;
        } else {
            return forbiddenResponse(reply, "Forbidden: You don't have the required permissions.");
        }
    };
};
