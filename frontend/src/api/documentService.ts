import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';

import { DocumentDto, FilterDocumentDto } from '@shared/dto';

class DocumentService {
    private apiUrl = '/api/documents';

    public async getAllDocuments(params: FilterDocumentDto): Promise<ApiResponse<DocumentDto[]>> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.status) queryParams.append('status', params.status);
        if (params.userId) queryParams.append('userId', params.userId);
        return api.fetchRequest(`${this.apiUrl}?${queryParams.toString()}`, 'GET', null, true);
    }

    public async getDocumentById(documentId: string): Promise<ApiResponse<DocumentDto>> {
        return api.fetchRequest(`${this.apiUrl}/${documentId}`, 'GET', null, true);
    }

    public async uploadDocument(file: File): Promise<ApiResponse<DocumentDto>> {
        const formData = new FormData();
        formData.append('file', file);
        return api.fetchRequest(`${this.apiUrl}`, 'POST', formData, true);
    }

    public async deleteDocument(documentId: string): Promise<ApiResponse<DocumentDto>> {
        return api.fetchRequest(`${this.apiUrl}/${documentId}`, 'DELETE', null, true);
    }
}

export const documentService = new DocumentService();
