import { applicationParameterRepository } from '@/repositories/applicationParameterRepository';
import { cacheService } from '@/services/cacheService';
import { applicationParameterTransformer } from '@/transformers/applicationParameterTransformer';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { badRequestResponse, internalServerError, jsonResponse, notFoundResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';
import { FastifyReply, FastifyRequest } from 'fastify';

import { Key } from '@/config/defaultApplicationParameters';
import {
    ApplicationParameterDto,
    FilterApplicationParameterDto,
    filterApplicationParameterSchema,
    IdParams,
    idParamsSchema,
    KeySchema,
    keySchema,
    UpdateApplicationParameterDto,
    updateApplicationParameterSchema
} from '@shared/dto';

class ApplicationParameterController {
    private logger = logger.child({
        module: '[App][ApplicationParameterController]',
    });

    public getAll = asyncHandler<unknown, FilterApplicationParameterDto, unknown, ApplicationParameterDto[]>({
        querySchema: filterApplicationParameterSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ApplicationParameterDto[] | void> | void> => {
            const { page = 1, limit = 10, search, category, isSystem } = request.query;
            const skip = (Number(page) - 1) * Number(limit);

            const filters = { search, category, isSystem };
            const result = await applicationParameterRepository.findAll(skip, Number(limit), filters);
            const applicationParameterDtos = applicationParameterTransformer.toApplicationParameterDtos(result.data);

            return jsonResponse(reply, 'Paramètres d\'application récupérés avec succès', applicationParameterDtos, 200, result.pagination);
        },
    });

    public getByKey = asyncHandler<unknown, unknown, KeySchema, ApplicationParameterDto>({
        paramsSchema: keySchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ApplicationParameterDto | void> | void> => {
            const { key } = request.params as unknown as { key: KeySchema };

            // Vérifier si la clé est valide
            if (!Object.values(Key).includes(key as Key)) {
                return reply.code(400).send({
                    success: false,
                    message: 'Clé de paramètre invalide'
                });
            }

            const parameter = await applicationParameterRepository.getParameterByKey(key as Key);

            if (!parameter) {
                return notFoundResponse(reply, 'Paramètre non trouvé');
            }

            const applicationParameterDto = applicationParameterTransformer.toApplicationParameterDto(parameter);
            return jsonResponse(reply, 'Paramètre récupéré avec succès', applicationParameterDto, 200);
        },
    });

    public update = asyncHandler<UpdateApplicationParameterDto, unknown, KeySchema, ApplicationParameterDto>({
        bodySchema: updateApplicationParameterSchema,
        paramsSchema: keySchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ApplicationParameterDto | void> | void> => {
            const { key } = request.params as unknown as { key: KeySchema };
            const { value } = request.body;

            // Vérifier si la clé est valide
            if (!Object.values(Key).includes(key as Key)) {
                return badRequestResponse(reply, 'Clé de paramètre invalide');
            }

            const parameterExists = await applicationParameterRepository.getParameterByKey(key as Key);
            if (!parameterExists) {
                return notFoundResponse(reply, 'Paramètre non trouvé');
            }

            this.logger.info('Mise à jour du paramètre', { key, value: value ? '***' : 'empty' });

            const updatedParameter = await applicationParameterRepository.updateParameter(key as Key, value);
            const applicationParameterDto = applicationParameterTransformer.toApplicationParameterDto(updatedParameter);

            return jsonResponse(reply, 'Paramètre mis à jour avec succès', applicationParameterDto, 200);
        },
    });

    public updateById = asyncHandler<UpdateApplicationParameterDto, unknown, IdParams, ApplicationParameterDto>({
        bodySchema: updateApplicationParameterSchema,
        logger: this.logger,
        paramsSchema: idParamsSchema,
        
        handler: async (request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse<ApplicationParameterDto | void> | void> => {
                
            
            const { id } = request.params as { id: string };
            const { value } = request.body as { value: string };

            try {
                const parameterExists = await applicationParameterRepository.findById(id);
                if (!parameterExists) {
                    return notFoundResponse(reply, 'Paramètre non trouvé');
                }

                const updatedParameter = await applicationParameterRepository.update(id, { value });
                
                // Invalider le cache pour ce paramètre
                const cacheKey = `app_param:${parameterExists.key}`;
                await cacheService.del(cacheKey);
                
                const applicationParameterDto = applicationParameterTransformer.toApplicationParameterDto(updatedParameter);

                return jsonResponse(reply, 'Paramètre mis à jour avec succès', applicationParameterDto, 200);
            } catch (error) {
                this.logger.error('Error updating parameter:', error);
                return internalServerError(reply, 'Erreur lors de la mise à jour du paramètre');
            }
        },
    });
}

export const applicationParameterController = new ApplicationParameterController();
