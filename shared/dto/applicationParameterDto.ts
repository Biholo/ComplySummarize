import { Serialize } from '@shared/types/Serialize';
import { z } from "zod";
import { querySchema } from "./commonDto";

const keys = [
    'CLAUDE_API_KEY',
    'MISTRAL_API_KEY',
    'GEMINI_API_KEY',
    'AI_MODEL',
]

export const updateApplicationParameterSchema = z.object({
    value: z.string(),
});

export type UpdateApplicationParameterSchema = z.infer<typeof updateApplicationParameterSchema>;
export type UpdateApplicationParameterDto = Serialize<UpdateApplicationParameterSchema>;

export const applicationParameterSchema = updateApplicationParameterSchema.extend({
    id: z.string(),
    key: z.enum(keys as [string, ...string[]]),
    createdAt: z.string(),
    updatedAt: z.string(),
    category: z.string(),
    isSystem: z.boolean(),
});

export type ApplicationParameterSchema = z.infer<typeof applicationParameterSchema>;
export type ApplicationParameterDto = Serialize<ApplicationParameterSchema>;

export const filterApplicationParameterSchema = querySchema.extend({
    category: z.string().optional(),
    isSystem: z.boolean().optional(),
});

export type FilterApplicationParameterSchema = z.infer<typeof filterApplicationParameterSchema>;
export type FilterApplicationParameterDto = Serialize<FilterApplicationParameterSchema>;

export const keySchema = z.enum(keys as [string, ...string[]]);
export type KeySchema = z.infer<typeof keySchema>;
