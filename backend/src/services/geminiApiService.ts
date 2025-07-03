import { applicationParameterRepository } from '@/repositories/applicationParameterRepository';
import { logger } from '@/utils/logger';

type GeminiResponse = {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
};

type GeminiRequest = {
  contents: {
    parts: { text?: string; inline_data?: { mime_type: string; data: string } }[];
  }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
};

class GeminiService {
  private apiUrl: string;
  private logger = logger.child({
    module: '[App][GeminiService]',
  });

  constructor() {
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';
  }

  private async getApiKey(): Promise<string> {
    const apiKey = await applicationParameterRepository.getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }
    return apiKey;
  }

  // Méthode pour compatibilité avec Claude (prompt text seul)
  public async sendRequest(prompt: string): Promise<string> {
    try {
      this.logger.info('Sending text request to Gemini API');
      
      const request: GeminiRequest = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      };

      return this.executeRequest(request);
    } catch (error) {
      this.logger.error('Error in sendRequest:', error);
      throw error;
    }
  }

  // Méthode pour analyser un document avec PDF
  public async analyzeDocument(prompt: string, pdfBase64: string): Promise<string> {
    try {
      this.logger.info('Sending document analysis request to Gemini API');
      
      const request: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: 'application/pdf',
                  data: pdfBase64
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      };

      return this.executeRequest(request);
    } catch (error) {
      this.logger.error('Error in analyzeDocument:', error);
      throw error;
    }
  }

  // Méthode privée pour exécuter les requêtes
  private async executeRequest(request: GeminiRequest): Promise<string> {
    try {
      const apiKey = await this.getApiKey();
      const response = await fetch(`${this.apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const responseBody = await response.text();
        this.logger.error('Gemini API request failed:', { 
          status: response.status, 
          body: responseBody 
        });
        throw new Error(`Gemini API request failed with status ${response.status}`);
      }
      
      const data = await response.json() as GeminiResponse;
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      this.logger.error('Error calling Gemini API:', error);
      throw new Error('Failed to communicate with Gemini AI API');
    }
  }
}

export const geminiService = new GeminiService(); 