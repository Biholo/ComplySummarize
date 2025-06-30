import { logger } from '@/utils/logger';
import { ActionSuggestionDto } from '@shared/dto';
import { ActionSuggestion } from '@/config/client';

class ActionSuggestionTransformer {
    private logger = logger.child({
        class: '[App][ActionSuggestionTransformer]',
    });

    /**
     * Transforme une ActionSuggestion de la base de données en DTO
     */
    public toActionSuggestionDto(actionSuggestion: ActionSuggestion): ActionSuggestionDto {
        return {
            id: actionSuggestion.id,
            title: actionSuggestion.title,
            isCompleted: actionSuggestion.isCompleted,
            label: actionSuggestion.label,
            documentId: actionSuggestion.documentId,
            createdAt: actionSuggestion.createdAt.toISOString(),
            updatedAt: actionSuggestion.updatedAt.toISOString(),
            deletedAt: actionSuggestion.deletedAt?.toISOString(),
            completedAt: actionSuggestion.completedAt?.toISOString(),
        };
    }

    /**
     * Transforme une liste d'ActionSuggestions en DTOs
     */
    public toActionSuggestionDtos(actionSuggestions: ActionSuggestion[]): ActionSuggestionDto[] {
        return actionSuggestions.map(actionSuggestion => this.toActionSuggestionDto(actionSuggestion));
    }


}

export const actionSuggestionTransformer = new ActionSuggestionTransformer(); 