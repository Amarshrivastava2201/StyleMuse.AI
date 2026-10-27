import {
  AiClothingAnalysisResult,
  AiOutfitRecommendation,
  ClothingItem,
  DeconstructOutfitResponse,
} from '@stylemuse/types';
import {
  GenerateOutfitParams,
  IAiFashionService,
  StylistChatParams,
  StylistChatResponse,
} from '../interfaces';
import { deconstructOutfitByInput } from '../mockup-catalog';

export class MockAiFashionService implements IAiFashionService {
  async analyzeClothingImage(
    imageUrlOrBase64: string,
    mimeType?: string
  ): Promise<AiClothingAnalysisResult> {
    // Simulate lightweight vision latency
    await new Promise((r) => setTimeout(r, 600));

    // Curated catalog presets for realistic local MVP testing
    const sampleItems: AiClothingAnalysisResult[] = [
      {
        name: 'Structured Linen Blend Shirt',
        category: 'tops',
        subcategory: 'button_down',
        primary_color: 'white',
        secondary_colors: [],
        pattern: 'solid',
        material: 'linen',
        formality: 'smart_casual',
        seasons: ['spring', 'summer'],
        fit: 'relaxed',
        confidence_score: 0.94,
      },
      {
        name: 'Relaxed Wide-Leg Pleated Chinos',
        category: 'bottoms',
        subcategory: 'chinos',
        primary_color: 'khaki',
        secondary_colors: [],
        pattern: 'solid',
        material: 'cotton',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        fit: 'relaxed',
        confidence_score: 0.92,
      },
      {
        name: 'Minimalist Leather Low-Tops',
        category: 'footwear',
        subcategory: 'sneakers',
        primary_color: 'white',
        secondary_colors: ['grey'],
        pattern: 'solid',
        material: 'leather',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        fit: 'regular',
        confidence_score: 0.96,
      },
      {
        name: 'Tailored Wool Overcoat',
        category: 'outerwear',
        subcategory: 'overcoat',
        primary_color: 'charcoal',
        secondary_colors: [],
        pattern: 'solid',
        material: 'wool',
        formality: 'business',
        seasons: ['fall', 'winter'],
        fit: 'regular',
        confidence_score: 0.95,
      },
    ];

    // Pick a deterministic or rotating item
    const picked = sampleItems[Math.floor(Math.random() * sampleItems.length)];
    return picked;
  }

  async generateOutfit(params: GenerateOutfitParams): Promise<AiOutfitRecommendation> {
    await new Promise((r) => setTimeout(r, 800));

    const { wardrobe, request } = params;
    if (!wardrobe || wardrobe.length === 0) {
      throw new Error('Wardrobe is empty. Upload at least a top, bottom, and footwear to generate outfits.');
    }

    const tops = wardrobe.filter((i) => i.category === 'tops');
    const bottoms = wardrobe.filter((i) => i.category === 'bottoms');
    const dresses = wardrobe.filter((i) => i.category === 'one-piece');
    const shoes = wardrobe.filter((i) => i.category === 'footwear');
    const outerwear = wardrobe.filter((i) => i.category === 'outerwear');

    const slots: Record<string, string> = {};

    if (dresses.length > 0 && (tops.length === 0 || Math.random() > 0.6)) {
      slots['one-piece'] = dresses[0].id;
    } else {
      if (tops.length > 0) slots['top'] = tops[0].id;
      if (bottoms.length > 0) slots['bottom'] = bottoms[0].id;
    }

    if (shoes.length > 0) {
      slots['shoes'] = shoes[0].id;
    }

    if (outerwear.length > 0 && Math.random() > 0.5) {
      slots['outerwear'] = outerwear[0].id;
    }

    const promptText = request.prompt || 'Effortless Contemporary Look';

    return {
      outfit_name: promptText.length > 30 ? 'Curated Day Ensemble' : promptText,
      slots: slots as any,
      stylist_notes:
        'This look balances silhouette proportions with harmonious neutral tones. The clean line of the top complements the structure of the bottom pieces, delivering an effortless yet intentional aesthetic.',
      vibe_keywords: ['timeless', 'elevated-casual', 'versatile'],
      weather_suitability: 'Ideal for moderate seasonal temperatures.',
    };
  }

  async chatStylist(params: StylistChatParams): Promise<StylistChatResponse> {
    await new Promise((r) => setTimeout(r, 700));

    let suggestedOutfit: AiOutfitRecommendation | undefined;
    const lowerMessage = params.userMessage.toLowerCase();

    if (
      lowerMessage.includes('outfit') ||
      lowerMessage.includes('what to wear') ||
      lowerMessage.includes('style me') ||
      lowerMessage.includes('date')
    ) {
      if (params.wardrobe.length > 0) {
        suggestedOutfit = await this.generateOutfit({
          request: { prompt: params.userMessage, locked_item_ids: [] },
          profile: params.profile,
          wardrobe: params.wardrobe,
        });
      }
    }

    const rawName = params.profile.full_name || params.profile.email?.split('@')[0] || '';
    const firstName = rawName.trim().split(/\s+/)[0] || 'there';

    return {
      reply: `I love that idea, ${firstName}! Based on your ${params.profile.style_archetypes?.join(' and ') || 'clean'} aesthetic, I’ve assembled a tailored combination from your real wardrobe that balances comfort with an elevated silhouette.`,
      suggestedOutfit,
    };
  }

  async deconstructOutfit(
    imageUrlOrBase64: string,
    mimeType?: string
  ): Promise<DeconstructOutfitResponse> {
    // Simulate multi-garment segmentation latency
    await new Promise((r) => setTimeout(r, 900));
    return deconstructOutfitByInput(imageUrlOrBase64);
  }
}
