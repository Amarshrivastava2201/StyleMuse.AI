import { IAiFashionService } from './interfaces';
import { MockAiFashionService } from './providers/mock.provider';
import { OpenAiFashionService } from './providers/openai.provider';

export interface AiFactoryOptions {
  provider?: 'mock' | 'openai' | 'gemini';
  openaiApiKey?: string;
  openaiBaseUrl?: string;
  openaiModel?: string;
}

export function createAiFashionService(options: AiFactoryOptions = {}): IAiFashionService {
  const provider = options.provider || (process.env.AI_PROVIDER as any) || 'mock';

  if (provider === 'openai') {
    const apiKey = options.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('[AiFashionService] OPENAI_API_KEY is not set. Falling back to zero-cost Mock provider.');
      return new MockAiFashionService();
    }
    return new OpenAiFashionService({
      apiKey,
      baseUrl: options.openaiBaseUrl || process.env.OPENAI_BASE_URL,
      model: options.openaiModel || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    });
  }

  // Default: zero-cost mock provider for local development without paid tokens
  return new MockAiFashionService();
}
