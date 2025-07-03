import { applicationParameterRepository } from '@/repositories/applicationParameterRepository';
import { logger } from '@/utils/logger';

type MistralResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

type MistralRequest = {
  model: string;
  messages: {
    role: 'user' | 'assistant';
    content: string | MessageContent[];
  }[];
  temperature?: number;
  max_tokens?: number;
};

type MessageContent = {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
};

class MistralService {
  private apiUrl: string;
  private logger = logger.child({
    module: '[App][MistralService]',
  });

  constructor() {
    this.apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  }

  private async getApiKey(): Promise<string> {
    const apiKey = await applicationParameterRepository.getMistralApiKey();
    if (!apiKey) {
      throw new Error('Mistral API key not configured');
    }
    return apiKey;
  }

  // Méthode pour compatibilité avec Claude (prompt text seul)
  public async sendRequest(prompt: string): Promise<string> {
    try {
      this.logger.info('Sending text request to Mistral API');
      
      const request: MistralRequest = {
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      };

      return this.executeRequest(request);
    } catch (error) {
      this.logger.error('Error in sendRequest:', error);
      throw error;
    }
  }

  // Méthode pour analyser un document avec PDF
  // Note: Mistral ne supporte pas nativement les PDFs, on retourne une erreur explicite
  public async analyzeDocument(prompt: string, pdfBase64: string): Promise<string> {
    try {
      this.logger.warn('Mistral API does not support PDF analysis, falling back to text-only');
      
      // Fallback: on envoie juste le prompt sans le PDF
      const fallbackPrompt = `${prompt}\n\n[Note: Le document PDF n'a pas pu être analysé par Mistral AI. Veuillez extraire le texte du document et le fournir directement.]`;
      
      return this.sendRequest(fallbackPrompt);
    } catch (error) {
      this.logger.error('Error in analyzeDocument:', error);
      throw error;
    }
  }

  // Méthode privée pour exécuter les requêtes
  private async executeRequest(request: MistralRequest): Promise<string> {
    try {
      const apiKey = await this.getApiKey();
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const responseBody = await response.text();
        this.logger.error('Mistral API request failed:', { 
          status: response.status, 
          body: responseBody 
        });
        throw new Error(`Mistral API request failed with status ${response.status}`);
      }
      
      const data = await response.json() as MistralResponse;
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Mistral API');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      this.logger.error('Error calling Mistral API:', error);
      throw new Error('Failed to communicate with Mistral AI API');
    }
  }
}

export const mistralService = new MistralService(); 