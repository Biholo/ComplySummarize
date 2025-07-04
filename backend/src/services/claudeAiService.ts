import { applicationParameterRepository } from '@/repositories/applicationParameterRepository';

type ClaudeRequest = {
  model: string;
  messages: { role: 'user' | 'assistant'; content: string | MessageContent[] }[];
  temperature?: number;
  max_tokens?: number;
};

type MessageContent = {
  type: 'text' | 'image' | 'document';
  source?: {
    type: 'base64' | 'file';
    media_type?: string;
    data?: string;
    file_id?: string;
  };
  text?: string;
};


class ClaudeService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  private async getApiKey(): Promise<string> {
    const apiKey = await applicationParameterRepository.getClaudeApiKey();
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }
    return apiKey;
  }

  // Méthode existante pour compatibilité (prompt text seul)
  public async sendRequest(prompt: string): Promise<string> {
    const request: ClaudeRequest = {
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    };

    return this.executeRequest(request);
  }

  // NOUVELLE : Méthode pour analyser un document avec PDF
  public async analyzeDocument(prompt: string, pdfBase64: string): Promise<string> {
    const content: MessageContent[] = [
      {
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: pdfBase64
        }
      },
      {
        type: 'text',
        text: prompt
      }
    ];

    const request: ClaudeRequest = {
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 4096,
      messages: [{ role: 'user', content }],
    };

    return this.executeRequest(request);
  }

  // Méthode privée pour exécuter les requêtes
  private async executeRequest(request: ClaudeRequest): Promise<string> {
    try {
      const apiKey = await this.getApiKey();
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      // @ts-ignore
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new Error('Failed to communicate with Claude AI API');
    }
  }
}

export const claudeService = new ClaudeService();

