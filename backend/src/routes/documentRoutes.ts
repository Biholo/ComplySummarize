import { documentController } from '@/controllers/documentController';
import { isAuthenticated } from '@/middleware/auth';
import { createSwaggerSchema } from '@/utils/swaggerUtils';
import { documentSchema, filterDocumentSchema } from '@shared/dto';
import { FastifyInstance } from 'fastify';

export async function documentRoutes(fastify: FastifyInstance) {
    // GET ALL - Récupérer tous les documents
    fastify.get('/', {
        schema: createSwaggerSchema(
            'Récupère tous les documents avec pagination et filtres.',
            [
                { message: 'Documents récupérés avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Erreur lors de la récupération des documents', data: [], status: 500 },
            ],
            null,
            true,
            filterDocumentSchema,
            ['Documents']
        ),
        preHandler: [isAuthenticated],
        handler: documentController.getAll,
    });

    // GET BY ID - Récupérer un document par ID
    fastify.get('/:id', {
        schema: createSwaggerSchema(
            'Récupère un document par son ID.',
            [
                { message: 'Document récupéré avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Document non trouvé', data: [], status: 404 },
                { message: 'Erreur lors de la récupération du document', data: [], status: 500 },
            ],
            null,
            true,
            null,
            ['Documents']
        ),
        preHandler: [isAuthenticated],
        handler: documentController.getById,
    });

    // CREATE - Créer un nouveau document
    fastify.post('/', {
        schema: createSwaggerSchema(
            'Crée un nouveau document.',
            [
                { message: 'Document créé avec succès', data: [], status: 201 },
                { message: 'Données invalides', data: [], status: 400 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Erreur lors de la création du document', data: [], status: 500 },
            ],
            null,
            true,
            null,
            ['Documents']
        ),
        preHandler: [isAuthenticated],
        handler: documentController.create,
    });

    // UPDATE - Mettre à jour un document
    fastify.patch('/:id', {
        schema: createSwaggerSchema(
            'Met à jour un document.',
            [
                { message: 'Document mis à jour avec succès', data: [], status: 200 },
                { message: 'Données invalides', data: [], status: 400 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Document non trouvé', data: [], status: 404 },
                { message: 'Erreur lors de la mise à jour du document', data: [], status: 500 },
            ],
            documentSchema.partial(),
            true,
            null,
            ['Documents']
        ),
        preHandler: [isAuthenticated],
        handler: documentController.update,
    });

    // DELETE - Supprimer un document
    fastify.delete('/:id', {
        schema: createSwaggerSchema(
            'Supprime un document (soft delete).',
            [
                { message: 'Document supprimé avec succès', data: [], status: 204 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Document non trouvé', data: [], status: 404 },
                { message: 'Erreur lors de la suppression du document', data: [], status: 500 },
            ],
            null,
            true,
            null,
            ['Documents']
        ),
        preHandler: [isAuthenticated],
        handler: documentController.delete,
    });

}
