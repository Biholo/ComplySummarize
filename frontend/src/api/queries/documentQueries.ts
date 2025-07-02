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
    queryFn: () => documentService.getAllDocuments(params).then(response => response.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook pour récupérer un document par son ID
 */
export const useGetDocumentById = (documentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentService.getDocumentById(documentId).then(response => response.data),
    enabled: !!documentId && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook pour uploader un document
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => documentService.uploadDocument(file).then(response => response.data),
    onSuccess: () => {
      // Invalider toutes les queries de documents pour rafraîchir les listes
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'upload du document:', error);
    },
  });
};

/**
 * Hook pour supprimer un document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => documentService.deleteDocument(documentId),
    onSuccess: () => {
      // Invalider toutes les queries de documents pour rafraîchir les listes
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du document:', error);
    },
  });
};
