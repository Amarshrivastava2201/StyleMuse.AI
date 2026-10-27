import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import {
  AiClothingAnalysisResultSchema,
  GenerateOutfitRequestSchema,
  SendStylistMessageRequestSchema,
  Profile,
} from '@stylemuse/types';

@ApiTags('AI Stylist & Vision')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('clothing-analysis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze garment image and return structured fashion metadata' })
  async analyzeClothing(@Body() body: { imageUrl: string; mimeType?: string }) {
    const analysis = await this.aiService.analyzeClothing(body.imageUrl, body.mimeType);
    return AiClothingAnalysisResultSchema.parse(analysis);
  }

  @Post('generate-outfit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Synthesize an outfit from user wardrobe based on request' })
  async generateOutfit(@Req() req: any, @Body() body: any) {
    const validRequest = GenerateOutfitRequestSchema.parse(body);

    // Mock wardrobe & profile if DB not yet connected or during dev
    const mockProfile: Profile = {
      id: req.user.id,
      email: req.user.email,
      style_archetypes: ['minimalist', 'smart_casual'],
      color_preferences: ['navy', 'white', 'grey'],
      color_dislikes: ['neon_green'],
      body_shape: 'athletic',
      gender_preference: 'unspecified',
      onboarding_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockWardrobe = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        user_id: req.user.id,
        name: 'Crisp White Poplin Shirt',
        category: 'tops' as const,
        subcategory: 'button_down',
        primary_color: 'white',
        secondary_colors: [],
        pattern: 'solid' as const,
        formality: 'smart_casual' as const,
        seasons: ['spring' as const, 'summer' as const],
        favorite: false,
        image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
        ai_metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        user_id: req.user.id,
        name: 'Pleated Charcoal Trousers',
        category: 'bottoms' as const,
        subcategory: 'trousers',
        primary_color: 'charcoal',
        secondary_colors: [],
        pattern: 'solid' as const,
        formality: 'smart_casual' as const,
        seasons: ['spring' as const, 'fall' as const],
        favorite: true,
        image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80',
        ai_metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        user_id: req.user.id,
        name: 'Leather Penny Loafers',
        category: 'footwear' as const,
        subcategory: 'loafers',
        primary_color: 'black',
        secondary_colors: [],
        pattern: 'solid' as const,
        formality: 'smart_casual' as const,
        seasons: ['spring' as const, 'summer' as const, 'fall' as const],
        favorite: false,
        image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4',
        ai_metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    return this.aiService.generateOutfit({
      request: validRequest,
      profile: mockProfile,
      wardrobe: mockWardrobe,
    });
  }

  @Post('stylist-chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chat with AI personal stylist Muse' })
  async stylistChat(@Req() req: any, @Body() body: any) {
    const validBody = SendStylistMessageRequestSchema.parse(body);

    const mockProfile: Profile = {
      id: req.user.id,
      email: req.user.email,
      style_archetypes: ['minimalist'],
      color_preferences: ['navy', 'white'],
      color_dislikes: [],
      body_shape: 'unspecified',
      gender_preference: 'unspecified',
      onboarding_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.aiService.chatStylist({
      userMessage: validBody.message,
      conversationHistory: [],
      profile: mockProfile,
      wardrobe: [],
    });
  }

  @Post('deconstruct-outfit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deconstruct outfit photo into isolated studio mockups with person removed' })
  async deconstructOutfit(@Body() body: { imageUrl: string; mimeType?: string }) {
    return this.aiService.deconstructOutfit(body.imageUrl, body.mimeType);
  }
}
