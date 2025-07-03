import queryClient from '@/configs/queryClient';
import { FilterApplicationParameterDto } from '@shared/dto';
import { useMutation, useQuery } from '@tanstack/react-query';
import { applicationParameterService } from '../applicationParameterService';

// ==========================================
// QUERIES
// ==========================================

/**
 * Hook pour récupérer tous les paramètres d'application avec filtres et pagination
 */
export const useGetAllParameters = (params?: FilterApplicationParameterDto) => {
  return useQuery({
    queryKey: ['parameters', params],
    queryFn: () => applicationParameterService.getAllParameters(params).then(response => response.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook pour récupérer un paramètre par sa clé
 */
export const useGetParameterByKey = (key: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['parameter', key],
    queryFn: () => applicationParameterService.getParameterByKey(key).then(response => response.data),
    enabled: !!key && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
};


// ==========================================
// MUTATIONS
// ==========================================

/**
 * Hook pour mettre à jour un paramètre d'application
 */
export const useUpdateParameter = () => {
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => 
      applicationParameterService.updateParameter(id, value).then(response => response.data),
    onSuccess: () => {
      // Invalider toutes les queries de paramètres pour rafraîchir les listes
      queryClient.invalidateQueries({ queryKey: ['parameters'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du paramètre:', error);
    },
  });
};
