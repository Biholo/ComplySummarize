import { applicationParameterController } from '@/controllers/applicationParameterController';
import { verifyAccess } from '@/middleware';
import { isAuthenticated } from '@/middleware/auth';
import { createSwaggerSchema } from '@/utils/swaggerUtils';

import {
    filterApplicationParameterSchema,
    updateApplicationParameterSchema
} from '@shared/dto';
import { Role } from '@shared/enums';
import { FastifyInstance } from 'fastify';

export async function applicationParameterRoutes(fastify: FastifyInstance) {
    // Récupérer tous les paramètres d'application
    fastify.get('/', {
        schema: createSwaggerSchema(
            'Récupère tous les paramètres d\'application.',
            [
                { message: 'Paramètres d\'application récupérés avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Accès refusé - rôle admin requis', data: [], status: 403 },
                {
                    message: 'Erreur lors de la récupération des paramètres',
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            filterApplicationParameterSchema,
            ['Administration']
        ),
        preHandler: [isAuthenticated, verifyAccess(Role.ADMIN)],
        handler: applicationParameterController.getAll,
    });

    // Récupérer un paramètre par clé
    fastify.get('/:key', {
        schema: createSwaggerSchema(
            'Récupère un paramètre d\'application par sa clé.',
            [
                { message: 'Paramètre récupéré avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Accès refusé - rôle admin requis', data: [], status: 403 },
                { message: 'Paramètre non trouvé', data: [], status: 404 },
                { message: 'Clé de paramètre invalide', data: [], status: 400 },
                {
                    message: 'Erreur lors de la récupération du paramètre',
                    data: [],
                    status: 500,
                },
            ],
            null,   
            true,
            null,
            ['Administration']
        ),
        preHandler: [isAuthenticated, verifyAccess(Role.ADMIN)],
        handler: applicationParameterController.getByKey,
    });

    // Mettre à jour un paramètre
    fastify.patch('/:id', {
        schema: createSwaggerSchema(
            'Met à jour un paramètre d\'application.',
            [
                { message: 'Paramètre mis à jour avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Accès refusé - rôle admin requis', data: [], status: 403 },
                { message: 'Paramètre non trouvé', data: [], status: 404 },
                { message: 'ID de paramètre invalide', data: [], status: 400 },
                {
                    message: 'Erreur lors de la mise à jour du paramètre',
                    data: [],
                    status: 500,
                },
            ],
            updateApplicationParameterSchema,
            true,
            null,
            ['Administration']
        ),
        preHandler: [isAuthenticated, verifyAccess(Role.ADMIN)],
        handler: applicationParameterController.updateById,
    });
}
