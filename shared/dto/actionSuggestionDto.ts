import { z } from "zod";
import { querySchema } from "./commonDto";
import { Serialize } from '@shared/types/Serialize';

export const actionSuggestionSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    isCompleted: z.boolean(),
    label: z.string(),
    documentId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    deletedAt: z.string().optional(),
    completedAt: z.string().optional(),
});

export type ActionSuggestionSchema = z.infer<typeof actionSuggestionSchema>;
export type ActionSuggestionDto = Serialize<ActionSuggestionSchema>;

export const filterActionSuggestionSchema = querySchema.extend({
    documentId: z.string().optional(),
});

export type FilterActionSuggestionSchema = z.infer<typeof filterActionSuggestionSchema>;
export type FilterActionSuggestionDto = Serialize<FilterActionSuggestionSchema>;
