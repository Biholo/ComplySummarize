import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import {
  ApplicationParameterDto,
  FilterApplicationParameterDto
} from '@shared/dto';

class ApplicationParameterService {
  private apiUrl = '/api/application-parameters';

  public async getAllParameters(params?: FilterApplicationParameterDto): Promise<ApiResponse<ApplicationParameterDto[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.isSystem !== undefined) queryParams.append('isSystem', params.isSystem.toString());
    
    const url = params && queryParams.toString() 
      ? `${this.apiUrl}?${queryParams.toString()}`
      : this.apiUrl;
    
    return api.fetchRequest(url, 'GET', null, true);
  }

  public async getParameterByKey(key: string): Promise<ApiResponse<ApplicationParameterDto>> {
    return api.fetchRequest(`${this.apiUrl}/${key}`, 'GET', null, true);
  }

  public async updateParameter(id: string, value: string): Promise<ApiResponse<ApplicationParameterDto>> {
    return api.fetchRequest(`${this.apiUrl}/${id}`, 'PATCH', { value }, true);
  }

}

export const applicationParameterService = new ApplicationParameterService(); 