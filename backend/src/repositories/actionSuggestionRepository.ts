import { Prisma } from "@/config/client";
import prisma from '@/config/prisma';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';
import { FilterActionSuggestionDto } from "@shared/dto";

class ActionSuggestionRepository {
    private logger = logger.child({
        class: '[App][ActionSuggestionRepository]',
    });

    async create(data: Prisma.ActionSuggestionCreateInput): Promise<any> {
        return prisma.actionSuggestion.create({
            data
        });
    }

    async createMany(data: Prisma.ActionSuggestionCreateManyInput[]): Promise<Prisma.BatchPayload> {
        return prisma.actionSuggestion.createMany({
            data
        });
    }

    async update(id: string, data: Prisma.ActionSuggestionUpdateInput): Promise<any> {
        return prisma.actionSuggestion.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
                ...(data.isCompleted === true && { completedAt: new Date() }),
                ...(data.isCompleted === false && { completedAt: null }),
            },
            include: {
                document: true
            }
        });
    }


    async delete(id: string): Promise<any> {
        return prisma.actionSuggestion.update({
            where: { id },
            data: {
                deletedAt: new Date()
            },
            include: {
                document: true
            }
        });
    }

    async findById(id: string): Promise<any | null> {
        return prisma.actionSuggestion.findUnique({
            where: { 
                id,
                deletedAt: null 
            },
            include: {
                document: true
            }
        });
    }

    async findAll(
        skip: number = 0,
        take: number = 10,
        filters: FilterActionSuggestionDto = {}
    ): Promise<{
        data: any[];
        pagination: PaginationMeta;
    }> {
        const where: any = {
            deletedAt: null,
        };

        if (filters.documentId) {
            where.documentId = filters.documentId;
        }

        if (filters.search) {   
            where.title = { 
                contains: filters.search,
                mode: 'insensitive'
            };
        }

        const include = {
            document: true
        };

        // Tri par défaut
        const orderBy = { createdAt: 'desc' as const };

        // Exécution des requêtes en parallèle
        const [data, total] = await Promise.all([
            prisma.actionSuggestion.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
            }),
            prisma.actionSuggestion.count({ where }),
        ]);

        // Métadonnées de pagination
        const currentPage = Math.floor(skip / take) + 1;
        const totalPages = Math.ceil(total / take);

        return {
            data,
            pagination: {
                currentPage,
                totalPages,
                totalItems: total,
                nextPage: currentPage < totalPages ? currentPage + 1 : 0,
                previousPage: currentPage > 1 ? currentPage - 1 : 0,
                perPage: take,
            },
        };
    }
}

export const actionSuggestionRepository = new ActionSuggestionRepository();
