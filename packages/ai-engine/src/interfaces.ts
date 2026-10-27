import {
  AiClothingAnalysisResult,
  AiOutfitRecommendation,
  ClothingItem,
  Profile,
  GenerateOutfitRequestDto,
  DeconstructOutfitResponse,
} from '@stylemuse/types';

export interface GenerateOutfitParams {
  request: GenerateOutfitRequestDto;
  profile: Profile;
  wardrobe: ClothingItem[];
}

export interface StylistChatParams {
  userMessage: string;
  conversationHistory: Array<{ sender: 'user' | 'stylist'; content: string }>;
  profile: Profile;
  wardrobe: ClothingItem[];
}

export interface StylistChatResponse {
  reply: string;
  suggestedOutfit?: AiOutfitRecommendation;
}

export interface IAiFashionService {
  analyzeClothingImage(
    imageUrlOrBase64: string,
    mimeType?: string
  ): Promise<AiClothingAnalysisResult>;

  generateOutfit(params: GenerateOutfitParams): Promise<AiOutfitRecommendation>;

  chatStylist(params: StylistChatParams): Promise<StylistChatResponse>;

  deconstructOutfit(
    imageUrlOrBase64: string,
    mimeType?: string
  ): Promise<DeconstructOutfitResponse>;
}
