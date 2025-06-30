import { Prisma } from "@/config/client";
import prisma from '@/config/prisma';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';
import { FilterKeyPointDto } from "@shared/dto";

class KeyPointRepository {
    private logger = logger.child({
        class: '[App][KeyPointRepository]',
    });

    async create(data: Prisma.KeyPointCreateInput): Promise<any> {
        return prisma.keyPoint.create({
            data
        });
    }

    async createMany(data: Prisma.KeyPointCreateManyInput[]): Promise<Prisma.BatchPayload> {
        return prisma.keyPoint.createMany({
            data
        });
    }

    async update(id: string, data: Prisma.KeyPointUpdateInput): Promise<any> {
        return prisma.keyPoint.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
            },
            include: {
                document: true
            }
        });
    }

    async delete(id: string): Promise<any> {
        return prisma.keyPoint.update({
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
        return prisma.keyPoint.findUnique({
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
        filters: FilterKeyPointDto = {}
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
            prisma.keyPoint.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
            }),
            prisma.keyPoint.count({ where }),
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

export const keyPointRepository = new KeyPointRepository();
