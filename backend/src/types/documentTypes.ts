import { documentRelations } from "@/repositories/documentRepository";
import { Prisma } from "@/config/client";

export type DocumentWithIncludedRelations = Prisma.DocumentGetPayload<{
    include: typeof documentRelations;
}>;