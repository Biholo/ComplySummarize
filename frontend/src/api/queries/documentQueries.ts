import { FilterDocumentDto } from '@shared/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../documentService';

// ==========================================
// QUERIES
// ==========================================

/**
 * Hook pour récupérer tous les documents avec filtres et pagination
 */
export const useGetAllDocuments = (params: FilterDocumentDto) => {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentService.getAllDocuments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook pour récupérer un document par son ID
 */
export const useGetDocumentById = (documentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentService.getDocumentById(documentId),
    enabled: !!documentId && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

/**
 * Hook pour uploader un document
 */
export const useUploadDocument = () => {

  return useMutation({
    mutationFn: (file: File) => documentService.uploadDocument(file),
    
  });
};
