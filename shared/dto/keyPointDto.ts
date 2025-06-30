import { z } from "zod";
import { querySchema } from "./commonDto";
import { Serialize } from '@shared/types/Serialize';

export const keyPointSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    documentId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    deletedAt: z.string().optional(),
});

export type KeyPointSchema = z.infer<typeof keyPointSchema>;
export type KeyPointDto = Serialize<KeyPointSchema>;


export const filterKeyPointSchema = querySchema.extend({
    documentId: z.string().optional(),
});

export type FilterKeyPointSchema = z.infer<typeof filterKeyPointSchema>;
export type FilterKeyPointDto = Serialize<FilterKeyPointSchema>;