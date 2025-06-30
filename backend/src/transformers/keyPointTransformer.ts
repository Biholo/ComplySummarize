import { logger } from '@/utils/logger';
import { KeyPointDto } from '@shared/dto';
import { KeyPoint } from '@/config/client';

class KeyPointTransformer {
    private logger = logger.child({
        class: '[App][KeyPointTransformer]',
    });

    /**
     * Transforme un KeyPoint de la base de données en DTO
     */
        public toKeyPointDto(keyPoint: KeyPoint): KeyPointDto {
            return {
            id: keyPoint.id,
            title: keyPoint.title,
            documentId: keyPoint.documentId,
            createdAt: keyPoint.createdAt.toISOString(),
            updatedAt: keyPoint.updatedAt.toISOString(),
            deletedAt: keyPoint.deletedAt?.toISOString(),
        };
    }

    /**
     * Transforme une liste de KeyPoints en DTOs
     */
    public toKeyPointDtos(keyPoints: KeyPoint[]): KeyPointDto[] {
        return keyPoints.map(keyPoint => this.toKeyPointDto(keyPoint));
    }

}

export const keyPointTransformer = new KeyPointTransformer(); 