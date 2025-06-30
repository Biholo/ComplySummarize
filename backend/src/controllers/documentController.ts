import { documentRepository } from '@/repositories/documentRepository';
import { documentTransformer } from '@/transformers/documentTransformer';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { jsonResponse, notFoundResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';

import { mediaRepository } from '@/repositories/mediaRepository';
import { claudeService } from '@/services/claudeAiService';
import { minioService } from '@/services/minioService';
import { PromptService } from '@/services/promptService';
import { DocumentDto, documentSchema, FilterDocumentDto, filterDocumentSchema, IdParams, idParamsSchema } from '@shared/dto';
import { DocumentCategory, DocumentStatus } from '@shared/enums/documentEnums';

class DocumentController {
    private logger = logger.child({
        module: '[App][DocumentController]',
    });

    public getAll = asyncHandler<unknown, FilterDocumentDto, unknown, DocumentDto[]>({
        querySchema: filterDocumentSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<DocumentDto[] | void> | void> => {
            const { page = 1, limit = 10, search, category, status, userId } = request.query;
            const skip = (Number(page) - 1) * Number(limit);

            const filters = { search, category, status, userId };
            const result = await documentRepository.findAll(filters, skip, Number(limit));
            const documents = result.data.map((document) => documentTransformer.toDocumentDto(document));

            return jsonResponse(reply, 'Documents récupérés avec succès', documents, 200, result.pagination);
        },
    });

    public getById = asyncHandler<unknown, unknown, IdParams, DocumentDto>({
        paramsSchema: idParamsSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<DocumentDto | void> | void> => {
            const { id } = request.params;
            const document = await documentRepository.findById(id);

            if (!document) {
                return notFoundResponse(reply, 'Document non trouvé');
            }

            const documentDto = documentTransformer.toDocumentDto(document);
            return jsonResponse(reply, 'Document récupéré avec succès', documentDto, 200);
        },
    });

    // ==========================================
    // MÉTHODE COMPLÈTE D'UPLOAD ET CRÉATION
    // ==========================================
    public create = asyncHandler<unknown, unknown, unknown, DocumentDto>({
        logger: this.logger,
        handler: async (request: any, reply: any): Promise<ApiResponse<DocumentDto | void> | void> => {
            console.log('request.body :', request.body);
            // ==========================================
            // ÉTAPE 1: RÉCUPÉRATION DU FICHIER MULTIPART
            // ==========================================
            const fileData = request.body?.file;
            if (!fileData) {
                return reply.code(400).send({
                    success: false,
                    message: 'Aucun fichier fourni'
                });
            }

            // ==========================================
            // ÉTAPE 2: VALIDATION DU TYPE DE FICHIER
            // ==========================================
            const allowedMimeTypes = [
                'application/pdf', 
                'text/plain', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            
            if (!allowedMimeTypes.includes(fileData.mimetype)) {
                return reply.code(400).send({
                    success: false,
                    message: 'Type de fichier non supporté. Formats acceptés: PDF, TXT, DOC, DOCX'
                });
            }

            this.logger.info('📄 Fichier reçu pour upload', { 
                filename: fileData.filename, 
                mimetype: fileData.mimetype,
                size: fileData._buf?.length || 0 
            });

            // ==========================================
            // ÉTAPE 3: UPLOAD VERS MINIO
            // ==========================================
            const uploadedFileName = await minioService.uploadFile(fileData);
            this.logger.info('☁️ Fichier uploadé sur MinIO', { 
                originalName: fileData.filename, 
                storedName: uploadedFileName 
            });

            // ==========================================
            // ÉTAPE 4: OBTENIR L'URL DU FICHIER
            // ==========================================
            const fileUrl = await minioService.getFile(uploadedFileName);

            // ==========================================
            const prompt = PromptService.generateCompleteAnalysisPrompt(fileData.filename || '');

            const media = await mediaRepository.create({
                url: fileUrl,
                filename: uploadedFileName,
                originalName: fileData.filename || '',
                mimeType: fileData.mimetype,
                size: fileData._buf?.length || 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // ==========================================
            // ÉTAPE 6: CRÉER LE DOCUMENT EN BASE
            // ==========================================
            const document = await documentRepository.create({
                filename: uploadedFileName,
                originalName: fileData.filename || '',
                category: DocumentCategory.REPORT,
                status: DocumentStatus.PENDING,
                user: {
                    connect: {
                        id: request.user?.id || 'system'
                    }
                },
                media: {
                    connect: {
                        id: media.id
                    }
                }
            });

            this.logger.info('✅ Document créé en base', { 
                documentId: document.id,
                status: document.status 
            });

            // ==========================================
            // ÉTAPE 7: ANALYSE AVEC CLAUDE
            // ==========================================
            const pdfBuffer = await minioService.downloadFile(fileUrl);
            const pdfBase64 = pdfBuffer.toString('base64');

            const analysisResponse = await claudeService.analyzeDocument(prompt, pdfBase64);

            const analysis = JSON.parse(analysisResponse);

            // ==========================================
            // ÉTAPE 8: MISE À JOUR FINALE DU DOCUMENT
            // ==========================================
            const finalDocument = await documentRepository.update(document.id, {
                status: DocumentStatus.COMPLETED,
                summary: analysis.summary,
                keyPoints: {
                    create: analysis.keyPoints.map((keyPoint: any) => ({
                        title: keyPoint.title,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }))
                },
                actionSuggestions: {
                    create: analysis.actionSuggestions.map((actionSuggestion: any) => ({
                        title: actionSuggestion.title,
                        label: actionSuggestion.label,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }))
                },
                category: analysis.category || DocumentCategory.REPORT,
                totalPages: analysis.totalPages || undefined,
                processingTime: Date.now()
            });

            this.logger.info('🎉 Document traité avec succès', { 
                documentId: finalDocument.id,
                finalStatus: finalDocument.status 
            });

            // ==========================================
            // ÉTAPE 12: TRANSFORMATION ET RÉPONSE
            // ==========================================
            
            const documentDto = documentTransformer.toDocumentDto(finalDocument);
            return jsonResponse(reply, 'Document uploadé et analysé avec succès', documentDto, 201);
        },
    });

    // ==========================================
    // MÉTHODES UTILITAIRES
    // ==========================================
    
 

    public update = asyncHandler<Partial<DocumentDto>, unknown, IdParams, DocumentDto>({
        bodySchema: documentSchema.partial(),
        paramsSchema: idParamsSchema,
        logger: this.logger,
        handler: async (request: any, reply: any): Promise<ApiResponse<DocumentDto | void> | void> => {
            const { id } = request.params;
            const updateData = request.body;

            const documentExists = await documentRepository.findById(id);
            if (!documentExists) {
                return notFoundResponse(reply, 'Document non trouvé');
            }

            const document = await documentRepository.update(id, updateData);
            const documentDto = documentTransformer.toDocumentDto(document);

            return jsonResponse(reply, 'Document mis à jour avec succès', documentDto, 200);
        },
    });

    public delete = asyncHandler<unknown, unknown, IdParams>({
        paramsSchema: idParamsSchema,
        logger: this.logger,
        handler: async (request: any, reply: any): Promise<ApiResponse<void> | void> => {
            const { id } = request.params;
            const documentExists = await documentRepository.findById(id);

            if (!documentExists) {
                return notFoundResponse(reply, 'Document non trouvé');
            }

            await documentRepository.delete(id);
            return jsonResponse(reply, 'Document supprimé avec succès', undefined, 204);
        },
    });
}

export const documentController = new DocumentController();
