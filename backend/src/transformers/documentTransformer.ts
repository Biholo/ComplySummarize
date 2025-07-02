import { DocumentWithIncludedRelations } from '@/types/documentTypes';
import { DocumentDto } from '@shared/dto';
import { DocumentCategory, DocumentStatus } from '@shared/enums/documentEnums';
import { actionSuggestionTransformer } from './actionSuggestionTransformer';
import { keyPointTransformer } from './keyPointTransformer';

class DocumentTransformer {
    public toDocumentDto(document: DocumentWithIncludedRelations): DocumentDto {
        return {
            id: document.id,
            filename: document.filename,
            originalName: document.originalName,
            totalPages: document.totalPages ?? undefined,
            category: document.category as DocumentCategory,
            size: document.media?.size ?? undefined,
            status: document.status as DocumentStatus,
            processingTime: document.processingTime ?? undefined,
            mediaId: document.mediaId,
            userId: document.userId,
            summary: document.summary ?? undefined,
            url: document.media?.url ?? undefined,
            keyPoints: document.keyPoints.map(keyPointTransformer.toKeyPointDto),
            actionSuggestions: document.actionSuggestions.map(actionSuggestionTransformer.toActionSuggestionDto),
            createdAt: document.createdAt.toISOString(),
            updatedAt: document.updatedAt.toISOString(),
            deletedAt: document.deletedAt?.toISOString()
        };
    }
}

export const documentTransformer = new DocumentTransformer();
