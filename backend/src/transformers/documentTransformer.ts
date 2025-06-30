import { DocumentWithIncludedRelations } from '@/types/documentTypes';
import { DocumentDto } from '@shared/dto';
import { DocumentCategory, DocumentStatus } from '@shared/enums/documentEnums';

class DocumentTransformer {
    public toDocumentDto(document: DocumentWithIncludedRelations): DocumentDto {
        return {
            filename: document.filename,
            originalName: document.originalName,
            totalPages: document.totalPages ?? undefined,
            category: document.category as DocumentCategory,
            size: document.media?.size ?? undefined,
            status: document.status as DocumentStatus,
            processingTime: document.processingTime ?? undefined,
            mediaId: document.mediaId,
            userId: document.userId,
            url: document.media?.url ?? undefined
        };
    }
}

export const documentTransformer = new DocumentTransformer();
