import { Injectable } from '@nestjs/common';
import {
  createAiFashionService,
  IAiFashionService,
  GenerateOutfitParams,
  StylistChatParams,
} from '@stylemuse/ai-engine';
import {
  AiClothingAnalysisResult,
  AiOutfitRecommendation,
} from '@stylemuse/types';

@Injectable()
export class AiService {
  private aiFashionService: IAiFashionService;

  constructor() {
    this.aiFashionService = createAiFashionService({
      provider: (process.env.AI_PROVIDER as any) || 'mock',
      openaiApiKey: process.env.OPENAI_API_KEY,
      openaiBaseUrl: process.env.OPENAI_BASE_URL,
      openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    });
  }

  async analyzeClothing(imageUrlOrBase64: string, mimeType?: string): Promise<AiClothingAnalysisResult> {
    return this.aiFashionService.analyzeClothingImage(imageUrlOrBase64, mimeType);
  }

  async generateOutfit(params: GenerateOutfitParams): Promise<AiOutfitRecommendation> {
    return this.aiFashionService.generateOutfit(params);
  }

  async chatStylist(params: StylistChatParams) {
    return this.aiFashionService.chatStylist(params);
  }

  async deconstructOutfit(imageUrlOrBase64: string, mimeType?: string) {
    return this.aiFashionService.deconstructOutfit(imageUrlOrBase64, mimeType);
  }
}
