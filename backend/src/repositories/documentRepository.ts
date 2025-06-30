import prisma from '@/config/prisma';
import { FilterService } from '@/services';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';
import { Prisma } from "@/config/client";

import { DocumentDto, FilterDocumentDto } from '@shared/dto';
import { DocumentWithIncludedRelations } from '@/types/documentTypes';

export const documentRelations = {
    user: true,
    media: true,
    keyPoints: true,
    actionSuggestions: true
}


class DocumentRepository {
    private logger = logger.child({
        class: '[App][DocumentRepository]',
    });
    

    async create(data: Prisma.DocumentCreateInput): Promise<DocumentWithIncludedRelations> {
        return prisma.document.create({
            data,
            include: documentRelations
        });
    }

    async update(id: string, data: Prisma.DocumentUpdateInput): Promise<DocumentWithIncludedRelations> {
        return prisma.document.update({
            where: { id },
            data: {
                ...(data.filename && { filename: data.filename }),
                ...(data.summary && { summary: data.summary }),
                ...(data.originalName && { originalName: data.originalName }),
                ...(data.totalPages !== undefined && { totalPages: data.totalPages }),
                ...(data.category && { category: data.category }),
                ...(data.status && { status: data.status }),
                ...(data.processingTime !== undefined && { processingTime: data.processingTime })
            },
            include: documentRelations
        });
    }

    async delete(id: string): Promise<DocumentWithIncludedRelations> {
        return prisma.document.update({
            where: { id },
            data: {
                deletedAt: new Date()
            },
            include: documentRelations
        });
    }

    async findById(id: string): Promise<DocumentWithIncludedRelations | null> {
        return prisma.document.findUnique({
            where: { 
                id,
                deletedAt: null 
            },
            include: documentRelations
        });
    }


    async findAll(
        filters: FilterDocumentDto = {},
        skip: number = 0,
        take: number = 10
    ): Promise<{
        data: DocumentWithIncludedRelations[];
        pagination: PaginationMeta;
    }> {
        const { search, category, status, userId, ...otherFilters } = filters;

        const where: any = {
            deletedAt: null,
        };

        // Recherche textuelle
        if (search) {
            where.OR = [
                { filename: { contains: search, mode: 'insensitive' } },
                { originalName: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Filtres spécifiques
        if (category) {
            where.category = category;
        }

        if (status) {
            where.status = status;
        }

        if (userId) {
            where.userId = userId;
        }

        const include = documentRelations;

        // Tri par défaut
        const orderBy = { createdAt: 'desc' as const };

        // Exécution des requêtes en parallèle
        const [data, total] = await Promise.all([
            prisma.document.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
            }),
            prisma.document.count({ where }),
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

export const documentRepository = new DocumentRepository(); 