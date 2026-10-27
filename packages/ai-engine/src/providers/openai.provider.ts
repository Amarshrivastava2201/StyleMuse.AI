import {
  AiClothingAnalysisResult,
  AiClothingAnalysisResultSchema,
  AiOutfitRecommendation,
  AiOutfitRecommendationSchema,
  DeconstructOutfitResponse,
  DeconstructOutfitResponseSchema,
} from '@stylemuse/types';
import {
  GenerateOutfitParams,
  IAiFashionService,
  StylistChatParams,
  StylistChatResponse,
} from '../interfaces';
import {
  CLOTHING_VISION_SYSTEM_PROMPT,
  OUTFIT_DECONSTRUCTION_SYSTEM_PROMPT,
  OUTFIT_GENERATOR_SYSTEM_PROMPT,
  STYLIST_CHAT_SYSTEM_PROMPT,
} from '../prompts';
import { resolveGarmentMockup } from '../mockup-catalog';

export interface OpenAiProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  visionModel?: string;
}

export class OpenAiFashionService implements IAiFashionService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private visionModel: string;

  constructor(config: OpenAiProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.model = config.model || 'gpt-4o-mini';
    this.visionModel = config.visionModel || config.model || 'gpt-4o-mini';
  }

  private async callChatCompletion(messages: any[], responseFormatJson = true, modelOverride?: string) {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: modelOverride || this.model,
        messages,
        temperature: 0.7,
        ...(responseFormatJson ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim();
  }

  async analyzeClothingImage(
    imageUrlOrBase64: string,
    mimeType = 'image/jpeg'
  ): Promise<AiClothingAnalysisResult> {
    const isUrl = imageUrlOrBase64.startsWith('http://') || imageUrlOrBase64.startsWith('https://');
    const imagePayload = isUrl
      ? { type: 'image_url', image_url: { url: imageUrlOrBase64 } }
      : {
          type: 'image_url',
          image_url: { url: `data:${mimeType};base64,${imageUrlOrBase64}` },
        };

    const rawJson = await this.callChatCompletion(
      [
        { role: 'system', content: CLOTHING_VISION_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this clothing item and return metadata JSON.' },
            imagePayload,
          ],
        },
      ],
      true,
      this.visionModel
    );

    const parsed = JSON.parse(rawJson);
    return AiClothingAnalysisResultSchema.parse(parsed);
  }

  async generateOutfit(params: GenerateOutfitParams): Promise<AiOutfitRecommendation> {
    const inventorySummary = params.wardrobe.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      primary_color: item.primary_color,
      pattern: item.pattern,
      formality: item.formality,
      seasons: item.seasons,
    }));

    const userContext = {
      style_archetypes: params.profile.style_archetypes,
      color_preferences: params.profile.color_preferences,
      color_dislikes: params.profile.color_dislikes,
      body_shape: params.profile.body_shape,
      request_prompt: params.request.prompt || 'Stylish everyday outfit',
      occasion: params.request.occasion,
      season: params.request.season,
      locked_item_ids: params.request.locked_item_ids,
    };

    const rawJson = await this.callChatCompletion([
      { role: 'system', content: OUTFIT_GENERATOR_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `User Style Profile & Request:
${JSON.stringify(userContext, null, 2)}

User Wardrobe Inventory:
${JSON.stringify(inventorySummary, null, 2)}

Create a coordinated outfit selecting strictly from the user's available item IDs.`,
      },
    ]);

    const parsed = JSON.parse(rawJson);
    return AiOutfitRecommendationSchema.parse(parsed);
  }

  async chatStylist(params: StylistChatParams): Promise<StylistChatResponse> {
    const history = params.conversationHistory.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    const inventoryShort = params.wardrobe.map((i) => `${i.id}: ${i.name} (${i.category})`);

    const systemPromptWithContext = `${STYLIST_CHAT_SYSTEM_PROMPT}

User Profile:
- Archetypes: ${params.profile.style_archetypes?.join(', ') || 'Eclectic'}
- Preferred Colors: ${params.profile.color_preferences?.join(', ') || 'Any'}
- Avoid Colors: ${params.profile.color_dislikes?.join(', ') || 'None'}

Wardrobe Items (ID: Name):
${inventoryShort.join('\n')}
`;

    const reply = await this.callChatCompletion(
      [
        { role: 'system', content: systemPromptWithContext },
        ...history,
        { role: 'user', content: params.userMessage },
      ],
      false
    );

    return { reply };
  }

  async deconstructOutfit(
    imageUrlOrBase64: string,
    mimeType = 'image/jpeg'
  ): Promise<DeconstructOutfitResponse> {
    const isUrl = imageUrlOrBase64.startsWith('http://') || imageUrlOrBase64.startsWith('https://');
    const imagePayload = isUrl
      ? { type: 'image_url', image_url: { url: imageUrlOrBase64 } }
      : {
          type: 'image_url',
          image_url: { url: `data:${mimeType};base64,${imageUrlOrBase64}` },
        };

    const rawJson = await this.callChatCompletion(
      [
        { role: 'system', content: OUTFIT_DECONSTRUCTION_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Deconstruct this outfit: detect all separate garments, remove the person, and return garment metadata JSON.',
            },
            imagePayload,
          ],
        },
      ],
      true,
      this.visionModel
    );

    const parsed = JSON.parse(rawJson);

    // Map detected garments to clean studio mockups (person removed)
    if (Array.isArray(parsed.items)) {
      parsed.items = parsed.items.map((item: any) => ({
        ...item,
        mockup_image_url:
          item.mockup_image_url ||
          resolveGarmentMockup(item.category, item.subcategory, item.primary_color),
      }));
    }

    return DeconstructOutfitResponseSchema.parse(parsed);
  }
}
