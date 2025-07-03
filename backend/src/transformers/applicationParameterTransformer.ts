import { ApplicationParameter } from '@/config/client';
import { logger } from '@/utils/logger';
import { ApplicationParameterDto } from '@shared/dto';

class ApplicationParameterTransformer {
    private logger = logger.child({
        class: '[App][ApplicationParameterTransformer]',
    });

    /**
     * Transforme une ApplicationParameter de la base de données en DTO
     */
    public toApplicationParameterDto(applicationParameter: ApplicationParameter): ApplicationParameterDto {
        return {
            id: applicationParameter.id,
            key: applicationParameter.key,
            value: applicationParameter.value,
            category: applicationParameter.category,
            isSystem: applicationParameter.isSystem,
            createdAt: applicationParameter.createdAt.toISOString(),
            updatedAt: applicationParameter.updatedAt.toISOString(),
        };
    }

    /**
     * Transforme une liste d'ApplicationParameters en DTOs
     */
    public toApplicationParameterDtos(applicationParameters: ApplicationParameter[]): ApplicationParameterDto[] {
        return applicationParameters.map(applicationParameter => this.toApplicationParameterDto(applicationParameter));
    }

}

export const applicationParameterTransformer = new ApplicationParameterTransformer();