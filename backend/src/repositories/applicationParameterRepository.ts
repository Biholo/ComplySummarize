import { ApplicationParameter, Prisma } from '@/config/client';
import { Key } from '@/config/defaultApplicationParameters';
import prisma from '@/config/prisma';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';
import { FilterApplicationParameterDto } from '@shared/dto';

class ApplicationParameterRepository {
    private logger = logger.child({
        class: '[App][ApplicationParameterRepository]',
    });

    /**
     * Créer un paramètre
     * @param data - Données du paramètre
     * @returns Promise<ApplicationParameter>
     */
    async create(data: Prisma.ApplicationParameterCreateInput): Promise<ApplicationParameter> {
        return prisma.applicationParameter.create({
            data
        });
    }

    /**
     * Méthode pour créer un paramètre avec validation
     * @param data - Données du paramètre à créer
     * @returns Promise<ApplicationParameter>
     */
    async createSafeParameter(data: {
        key: Key;
        value: string;
        category?: string;
        isSystem?: boolean;
    }): Promise<ApplicationParameter> {
        return prisma.applicationParameter.create({
            data: {
                key: data.key,
                value: data.value,
                category: data.category || 'general',
                isSystem: data.isSystem || false
            }
        });
    }

    /**
     * Mettre à jour un paramètre par ID
     * @param id - ID du paramètre
     * @param data - Données de mise à jour
     * @returns Promise<ApplicationParameter>
     */
    async update(id: string, data: Prisma.ApplicationParameterUpdateInput): Promise<ApplicationParameter> {
        return prisma.applicationParameter.update({
            where: { id },
            data
        });
    }

    /**
     * Mettre à jour un paramètre par clé
     * @param key - Clé du paramètre
     * @param value - Nouvelle valeur
     * @returns Promise<ApplicationParameter>
     */
    async updateParameter(key: Key, value: string): Promise<ApplicationParameter> {
        return prisma.applicationParameter.update({
            where: { key },
            data: { value },
        });
    }

    /**
     * Supprimer un paramètre par ID
     * @param id - ID du paramètre
     * @returns Promise<void>
     */
    async delete(id: string): Promise<void> {
        await prisma.applicationParameter.delete({
            where: { id }
        });
    }

    /**
     * Supprimer un paramètre par sa clé
     * @param key - Clé du paramètre
     * @returns Promise<ApplicationParameter | null>
     */
    async deleteParameterByKey(key: Key): Promise<ApplicationParameter | null> {
        const param = await this.getParameterByKey(key);
        if (!param) return null;
        
        return prisma.applicationParameter.delete({
            where: { key }
        });
    }

    /**
     * Récupérer un paramètre par ID
     * @param id - ID du paramètre
     * @returns Promise<ApplicationParameter | null>
     */
    async findById(id: string): Promise<ApplicationParameter | null> {
        return prisma.applicationParameter.findUnique({
            where: { id }
        });
    }

    /**
     * Récupérer un paramètre par sa clé
     * @param key - Clé du paramètre
     * @returns Promise<ApplicationParameter | null>
     */
    async getParameterByKey(key: Key): Promise<ApplicationParameter | null> {
        return prisma.applicationParameter.findFirst({
            where: { key },
        });
    }

    /**
     * Récupérer tous les paramètres avec pagination et filtres
     * @param skip - Nombre d'éléments à ignorer
     * @param take - Nombre d'éléments à prendre
     * @param filters - Filtres à appliquer
     * @returns Promise<{data: ApplicationParameter[]; pagination: PaginationMeta}>
     */
    async findAll(
        skip: number = 0,
        take: number = 10,
        filters: FilterApplicationParameterDto = {}
    ): Promise<{
        data: ApplicationParameter[];
        pagination: PaginationMeta;
    }> {
        const where: Prisma.ApplicationParameterWhereInput = {};

        // Filtres
        if (filters.category) {
            where.category = filters.category;
        }

        if (filters.isSystem !== undefined) {
            where.isSystem = filters.isSystem;
        }

        if (filters.search) {
            where.OR = [
                {
                    value: {
                        contains: filters.search
                    }
                },
                {
                    category: {
                        contains: filters.search
                    }
                }
            ];
        }

        // Tri par défaut
        const orderBy = { createdAt: 'desc' as const };

        // Exécution des requêtes en parallèle
        const [data, total] = await Promise.all([
            prisma.applicationParameter.findMany({
                where,
                skip,
                take,
                orderBy,
            }),
            prisma.applicationParameter.count({ where }),
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

    /**
     * Récupérer les paramètres par catégorie
     * @param category - Catégorie des paramètres
     * @returns Promise<ApplicationParameter[]>
     */
    async getParametersByCategory(category: string): Promise<ApplicationParameter[]> {
        return prisma.applicationParameter.findMany({
            where: { category },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Récupérer tous les paramètres système
     * @returns Promise<ApplicationParameter[]>
     */
    async getSystemParameters(): Promise<ApplicationParameter[]> {
        return prisma.applicationParameter.findMany({
            where: { isSystem: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Récupérer tous les paramètres non-système
     * @returns Promise<ApplicationParameter[]>
     */
    async getNonSystemParameters(): Promise<ApplicationParameter[]> {
        return prisma.applicationParameter.findMany({
            where: { isSystem: false },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Récupérer et parser un paramètre
     * @param key - Clé du paramètre
     * @param defaultValue - Valeur par défaut
     * @returns Promise<T | null>
     */
    async getParameter<T>(key: Key, defaultValue?: T): Promise<T | null> {
        const param = await this.getParameterByKey(key);
        
        if (!param) {
            return defaultValue ?? null;
        }
        
        try {
            // Tenter de parser comme JSON si c'est une chaîne qui ressemble à un objet/tableau
            if (typeof param.value === 'string' && 
                (param.value.startsWith('{') || param.value.startsWith('['))) {
                return JSON.parse(param.value);
            }
            
            return param.value as unknown as T;
        } catch (error) {
            // En cas d'erreur de parsing, retourner la valeur brute
            return param.value as unknown as T;
        }
    }
    
    /**
     * Mettre à jour ou créer un paramètre
     * @param key - Clé du paramètre
     * @param value - Valeur du paramètre
     * @param category - Catégorie du paramètre
     * @returns Promise<ApplicationParameter>
     */
    async updateOrCreateParameter(
        key: Key, 
        value: string, 
        category?: string
    ): Promise<ApplicationParameter> {
        const existingParam = await this.getParameterByKey(key);
        
        if (existingParam) {
            return prisma.applicationParameter.update({
                where: { key },
                data: { 
                    value,
                    ...(category && { category })
                },
            });
        } else {
            return prisma.applicationParameter.create({
                data: {
                    key,
                    value,
                    category: category || 'general',
                    isSystem: false
                }
            });
        }
    }

    /**
     * Vérifier si un paramètre existe
     * @param key - Clé du paramètre
     * @returns Promise<boolean>
     */
    async exists(key: Key): Promise<boolean> {
        const param = await this.getParameterByKey(key);
        return param !== null;
    }

    async getClaudeApiKey(): Promise<string | null> {
        return this.getParameter(Key.CLAUDE_API_KEY) || '';
    }

    async getGeminiApiKey(): Promise<string | null> {
        return this.getParameter(Key.GEMINI_API_KEY) || '';
    }

    async getMistralApiKey(): Promise<string | null> {
        return this.getParameter(Key.MISTRAL_API_KEY) || '';
    }

    async getAiModel(): Promise<string | null> {
        return this.getParameter(Key.AI_MODEL) || '';
    }
}

export const applicationParameterRepository = new ApplicationParameterRepository();