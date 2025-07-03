import { AuthResponse } from '@/types';
import Cookies from 'js-cookie';

class Interceptor {
    private url: string;

    constructor() {
        this.url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    }

    public getUrl(): string {
        return this.url;
    }

    private createHeaders(includeAuth: boolean = false, isFormData: boolean = false, hasBody: boolean = true): HeadersInit {
        const headers: HeadersInit = {};

        if (hasBody && !isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        if (includeAuth) {
            const token = Cookies.get('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    public async fetchMultipartRequest(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        body: any = null,
        includeAuth: boolean = false
    ): Promise<any> {
        const isFormData = body instanceof FormData;
        const hasBody = body !== null && body !== undefined;
        const fullUrl = `${this.url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        const options: RequestInit = {
            method,
            headers: {
                ...this.createHeaders(includeAuth, isFormData, hasBody),
            },
        };

        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        try {
            const response = await fetch(fullUrl, options);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    errorData = { message: response.statusText };
                }
                throw new Error(
                    errorData.message || `${method} request failed: ${response.statusText}`
                );
            }

            try {
                return await response.json();
            } catch (jsonError) {
                return { success: true };
            }
        } catch (error: any) {
            console.error('Request error:', error);
            throw new Error(error.message || 'Une erreur est survenue lors de la requête');
        }
    }

    // Fonction générique pour gérer toutes les requêtes HTTP
    public async fetchRequest(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        body: any = null,
        includeAuth: boolean = false
    ): Promise<any> {
        const isFormData = body instanceof FormData;
        const hasBody = body !== null && body !== undefined;
        const fullUrl = `${this.url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        
        const headers = this.createHeaders(includeAuth, isFormData, hasBody);
        
        const options: RequestInit = {
            method,
            headers,
        };

        if (body && method !== 'GET') {
            if (isFormData) {
                options.body = body;
            } else {
                options.body = JSON.stringify(body);
            }
        }

        try {
            const response = await fetch(fullUrl, options);
            


            if (!response.ok) {
                let errorData;
                try {
                    const errorText = await response.text();
                    console.error(`❌ ${method} Error Response:`, errorText);
                    
                    try {
                        errorData = JSON.parse(errorText);
                    } catch (parseError) {
                        errorData = { message: errorText || response.statusText };
                    }
                } catch (textError) {
                    errorData = { message: response.statusText };
                }
                
                const errorMessage = errorData.message || `${method} request failed: ${response.statusText}`;
                console.error(`❌ ${method} Request Failed:`, errorMessage);
                throw new Error(errorMessage);
            }

            try {
                const responseData = await response.json();
                

                
                return responseData;
            } catch (jsonError) {
                return { success: true };
            }
        } catch (error: any) {
            console.error(`❌ ${method} Request Error:`, error);
            

            
            throw new Error(error.message || 'Une erreur est survenue lors de la requête');
        }
    }

    // Récupération d'un nouveau token via le refresh token
    public async getNewAccessToken(refreshToken: string): Promise<AuthResponse | null> {
        const response = await this.fetchRequest('/api/auth/refresh', 'POST', {
            token: refreshToken,
        });

        if (response.token) {
            Cookies.set('accessToken', response.token, { expires: 1 }); // expire dans 1 jour
        }

        if (response.refreshToken) {
            Cookies.set('refreshToken', response.refreshToken, { expires: 30 }); // expire dans 30 jours
        }

        return response || null;
    }
}

export const api = new Interceptor();
