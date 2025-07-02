import { DocumentCategory, DocumentStatus } from "@shared/enums/documentEnums";
import { Serialize } from '@shared/types/Serialize';
import { z } from "zod";
import { actionSuggestionSchema } from "./actionSuggestionDto";
import { querySchema } from "./commonDto";
import { keyPointSchema } from "./keyPointDto";


export const documentSchema = z.object({
    id: z.string(),
    filename: z.string(),
    originalName: z.string(),
    totalPages: z.number().optional(),
    category: z.nativeEnum(DocumentCategory),
    summary: z.string().optional(),
    size: z.number().optional(),
    status: z.nativeEnum(DocumentStatus),
    processingTime: z.number().optional(),
    mediaId: z.string(),
    userId: z.string(),
    url: z.string().optional(),
    keyPoints: z.array(keyPointSchema),
    actionSuggestions: z.array(actionSuggestionSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().optional(),
});

export type DocumentSchema = z.infer<typeof documentSchema>;
export type DocumentDto = Serialize<DocumentSchema>;

export const filterDocumentSchema = querySchema.extend({
    category: z.nativeEnum(DocumentCategory).optional(),
    status: z.nativeEnum(DocumentStatus).optional(),
    userId: z.string().optional(),
});

export type FilterDocumentSchema = z.infer<typeof filterDocumentSchema>;
export type FilterDocumentDto = Serialize<FilterDocumentSchema>;