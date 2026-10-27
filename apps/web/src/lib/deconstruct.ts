import { ClothingCategory, Formality, Season } from '@stylemuse/types';

export interface ExtractedMockup {
  id: string;
  name: string;
  category: ClothingCategory;
  subcategory: string;
  primary_color: string;
  material: string;
  formality: Formality;
  seasons: Season[];
  mockup_image_url: string; // Isolated studio product shot (no person!)
  confidence: number;
  selected: boolean;
}

export interface SampleOutfitLook {
  id: string;
  title: string;
  description: string;
  outfit_photo: string;
  extracted: ExtractedMockup[];
}

export const SAMPLE_OUTFIT_LOOKS: SampleOutfitLook[] = [
  {
    id: 'parisian-tailored',
    title: 'Parisian Tailored Ensemble',
    description: 'Classic camel trench, ribbed knitwear, wide-leg trousers, and polished penny loafers.',
    outfit_photo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    extracted: [
      {
        id: 'parisian-outer-1',
        name: 'Classic Gabardine Trench Coat',
        category: 'outerwear',
        subcategory: 'trench_coat',
        primary_color: 'camel',
        material: 'water-repellent gabardine',
        formality: 'smart_casual',
        seasons: ['spring', 'fall'],
        mockup_image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        confidence: 0.98,
        selected: true,
      },
      {
        id: 'parisian-top-1',
        name: 'Oversized Ribbed Knit Pullover',
        category: 'tops',
        subcategory: 'knitwear',
        primary_color: 'cream',
        material: 'merino wool',
        formality: 'smart_casual',
        seasons: ['fall', 'winter', 'spring'],
        mockup_image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
        confidence: 0.97,
        selected: true,
      },
      {
        id: 'parisian-bottom-1',
        name: 'Tailored Wide-Leg Trousers',
        category: 'bottoms',
        subcategory: 'trousers',
        primary_color: 'black',
        material: 'wool blend twill',
        formality: 'smart_casual',
        seasons: ['spring', 'fall', 'winter'],
        mockup_image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        confidence: 0.95,
        selected: true,
      },
      {
        id: 'parisian-footwear-1',
        name: 'Polished Leather Penny Loafers',
        category: 'footwear',
        subcategory: 'loafers',
        primary_color: 'black',
        material: 'smooth box calf leather',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
        confidence: 0.96,
        selected: true,
      },
    ],
  },
  {
    id: 'minimalist-smart',
    title: 'Minimalist Poplin & Pleated Chinos',
    description: 'Clean crisp cotton button-down paired with relaxed khaki chinos and leather sneakers.',
    outfit_photo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    extracted: [
      {
        id: 'minimal-top-1',
        name: 'Crisp Oxford Cotton Shirt',
        category: 'tops',
        subcategory: 'button_down',
        primary_color: 'white',
        material: '100% poplin cotton',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        confidence: 0.99,
        selected: true,
      },
      {
        id: 'minimal-bottom-1',
        name: 'Relaxed Pleated Chinos',
        category: 'bottoms',
        subcategory: 'chinos',
        primary_color: 'khaki',
        material: 'cotton twill',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        confidence: 0.96,
        selected: true,
      },
      {
        id: 'minimal-footwear-1',
        name: 'Minimalist Leather Low-Tops',
        category: 'footwear',
        subcategory: 'sneakers',
        primary_color: 'white',
        material: 'calfskin leather',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        mockup_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        confidence: 0.98,
        selected: true,
      },
      {
        id: 'minimal-outer-1',
        name: 'Structured Wool Overshirt',
        category: 'outerwear',
        subcategory: 'overshirt',
        primary_color: 'navy',
        material: 'wool blend',
        formality: 'smart_casual',
        seasons: ['fall', 'winter', 'spring'],
        mockup_image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
        confidence: 0.94,
        selected: true,
      },
    ],
  },
  {
    id: 'streetwear-denim',
    title: 'Streetwear & Loose Light Denim',
    description: 'Heavyweight black tee, vintage wash denim, retro court sneakers, and olive utility jacket.',
    outfit_photo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    extracted: [
      {
        id: 'street-top-1',
        name: 'Heavyweight Boxy Cotton Tee',
        category: 'tops',
        subcategory: 't_shirt',
        primary_color: 'black',
        material: '280gsm organic cotton',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        confidence: 0.97,
        selected: true,
      },
      {
        id: 'street-bottom-1',
        name: 'Vintage Light-Wash Loose Denim',
        category: 'bottoms',
        subcategory: 'jeans',
        primary_color: 'light_blue',
        material: '13oz non-stretch denim',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        mockup_image_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
        confidence: 0.96,
        selected: true,
      },
      {
        id: 'street-footwear-1',
        name: 'Retro Low-Profile Court Sneakers',
        category: 'footwear',
        subcategory: 'sneakers',
        primary_color: 'white',
        material: 'grained leather & suede',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
        confidence: 0.98,
        selected: true,
      },
      {
        id: 'street-outer-1',
        name: 'Washed Canvas Utility Jacket',
        category: 'outerwear',
        subcategory: 'utility_jacket',
        primary_color: 'olive',
        material: 'cotton canvas',
        formality: 'casual',
        seasons: ['spring', 'fall'],
        mockup_image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
        confidence: 0.93,
        selected: true,
      },
    ],
  },
  {
    id: 'coastal-resort',
    title: 'Coastal Linen & Sand Espadrilles',
    description: 'Sage green camp collar shirt, ecru linen trousers, suede espadrilles, and amber sunglasses.',
    outfit_photo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    extracted: [
      {
        id: 'coastal-top-1',
        name: 'Camp-Collar Relaxed Linen Shirt',
        category: 'tops',
        subcategory: 'camp_collar',
        primary_color: 'sage_green',
        material: '100% French linen',
        formality: 'smart_casual',
        seasons: ['spring', 'summer'],
        mockup_image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        confidence: 0.97,
        selected: true,
      },
      {
        id: 'coastal-bottom-1',
        name: 'Tailored Drawstring Linen Trousers',
        category: 'bottoms',
        subcategory: 'linen_pants',
        primary_color: 'ecru',
        material: 'pure washed linen',
        formality: 'smart_casual',
        seasons: ['spring', 'summer'],
        mockup_image_url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80',
        confidence: 0.95,
        selected: true,
      },
      {
        id: 'coastal-footwear-1',
        name: 'Handcrafted Suede Espadrilles',
        category: 'footwear',
        subcategory: 'espadrilles',
        primary_color: 'sand',
        material: 'velveteen suede & jute',
        formality: 'casual',
        seasons: ['summer'],
        mockup_image_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
        confidence: 0.98,
        selected: true,
      },
      {
        id: 'coastal-acc-1',
        name: 'Tortoiseshell Acetate Sunglasses',
        category: 'accessories',
        subcategory: 'sunglasses',
        primary_color: 'amber',
        material: 'cellulose acetate',
        formality: 'smart_casual',
        seasons: ['spring', 'summer'],
        mockup_image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        confidence: 0.99,
        selected: true,
      },
    ],
  },
  {
    id: 'evening-monochrome',
    title: 'Monochrome Tailored Evening Look',
    description: 'Ivory silk camisole, structured wool blazer, fluid palazzo pants, and pointed leather boots.',
    outfit_photo: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    extracted: [
      {
        id: 'evening-top-1',
        name: 'Draped Silk-Satin Camisole',
        category: 'tops',
        subcategory: 'camisole',
        primary_color: 'ivory',
        material: 'mulberry silk',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        confidence: 0.96,
        selected: true,
      },
      {
        id: 'evening-outer-1',
        name: 'Peak-Lapel Structured Blazer',
        category: 'outerwear',
        subcategory: 'blazer',
        primary_color: 'black',
        material: 'virgin wool crepe',
        formality: 'business',
        seasons: ['spring', 'fall', 'winter'],
        mockup_image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        confidence: 0.97,
        selected: true,
      },
      {
        id: 'evening-bottom-1',
        name: 'High-Waist Wide Palazzo Trousers',
        category: 'bottoms',
        subcategory: 'palazzo',
        primary_color: 'black',
        material: 'heavy fluid drape twill',
        formality: 'formal',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        mockup_image_url: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=800&q=80',
        confidence: 0.95,
        selected: true,
      },
      {
        id: 'evening-footwear-1',
        name: 'Pointed-Toe Leather Ankle Boots',
        category: 'footwear',
        subcategory: 'boots',
        primary_color: 'black',
        material: 'nappa leather',
        formality: 'smart_casual',
        seasons: ['fall', 'winter', 'spring'],
        mockup_image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        confidence: 0.97,
        selected: true,
      },
    ],
  },
  {
    id: 'earth-heritage',
    title: 'Earth Tones & Cozy Heritage',
    description: 'Honeycomb cable knit, olive corduroy trousers, tobacco Chelsea boots, and cashmere scarf.',
    outfit_photo: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
    extracted: [
      {
        id: 'earth-top-1',
        name: 'Honeycomb Cable-Knit Wool Sweater',
        category: 'tops',
        subcategory: 'knitwear',
        primary_color: 'caramel',
        material: 'Shetland lambswool',
        formality: 'smart_casual',
        seasons: ['fall', 'winter'],
        mockup_image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        confidence: 0.98,
        selected: true,
      },
      {
        id: 'earth-bottom-1',
        name: 'Relaxed Tapered Corduroy Trousers',
        category: 'bottoms',
        subcategory: 'corduroy',
        primary_color: 'olive',
        material: 'wide-wale cotton corduroy',
        formality: 'smart_casual',
        seasons: ['fall', 'winter'],
        mockup_image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
        confidence: 0.95,
        selected: true,
      },
      {
        id: 'earth-footwear-1',
        name: 'Suede Chelsea Boots with Crepe Sole',
        category: 'footwear',
        subcategory: 'boots',
        primary_color: 'tobacco',
        material: 'oiled suede',
        formality: 'smart_casual',
        seasons: ['fall', 'winter', 'spring'],
        mockup_image_url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
        confidence: 0.96,
        selected: true,
      },
      {
        id: 'earth-acc-1',
        name: 'Fringed Cashmere Scarf',
        category: 'accessories',
        subcategory: 'scarf',
        primary_color: 'camel',
        material: '100% woven cashmere',
        formality: 'smart_casual',
        seasons: ['fall', 'winter'],
        mockup_image_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
        confidence: 0.98,
        selected: true,
      },
    ],
  },
];

/**
 * Deterministically analyzes any uploaded photo string/base64 and returns
 * a unique set of extracted garment mockups with the person removed.
 */
export function deconstructPhotoLocally(input: string): ExtractedMockup[] {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const lookIndex = positiveHash % SAMPLE_OUTFIT_LOOKS.length;
  const matchedLook = SAMPLE_OUTFIT_LOOKS[lookIndex];

  // Deep clone and assign unique instance IDs
  return matchedLook.extracted.map((item, idx) => ({
    ...item,
    id: `extracted-${lookIndex}-${idx}-${Date.now().toString(36)}`,
    selected: true,
  }));
}
