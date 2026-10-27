import { ClothingCategory, DeconstructedItemMockup, DeconstructOutfitResponse } from '@stylemuse/types';

// Curated library of isolated studio product shots (person removed, pure neutral background)
export const STUDIO_MOCKUP_IMAGES: Record<ClothingCategory, Record<string, string>> = {
  tops: {
    white_shirt: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    cream_knit: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    black_tee: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    sage_linen: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    striped_tee: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    grey_zip: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    caramel_knit: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    silk_camisole: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
  },
  bottoms: {
    khaki_chinos: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    light_denim: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    black_trousers: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    linen_pants: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80',
    wide_black: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=800&q=80',
    raw_indigo: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    charcoal_joggers: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
    green_corduroy: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
  },
  footwear: {
    white_sneakers: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    black_loafers: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    court_sneakers: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    sand_espadrilles: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    black_boots: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    canvas_high_tops: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    running_shoes: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    tobacco_chelsea: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
  },
  outerwear: {
    camel_trench: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    navy_overshirt: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    charcoal_overcoat: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    olive_jacket: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    black_blazer: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    denim_trucker: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
  },
  'one-piece': {
    slip_dress: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    linen_jumpsuit: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  accessories: {
    amber_sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    nylon_crossbody: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    cashmere_scarf: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
    leather_belt: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
  },
};

export function resolveGarmentMockup(
  category: ClothingCategory,
  subcategory = '',
  primaryColor = ''
): string {
  const categoryPool = STUDIO_MOCKUP_IMAGES[category] || STUDIO_MOCKUP_IMAGES.tops;
  const sub = subcategory.toLowerCase();
  const col = primaryColor.toLowerCase();

  // Try matching by color or subcategory key
  for (const [key, url] of Object.entries(categoryPool)) {
    if (key.includes(col) || (sub && key.includes(sub))) {
      return url;
    }
  }

  // Fallback to first available clean mockup in category
  const urls = Object.values(categoryPool);
  return urls[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80';
}

export interface CuratedLookPreset {
  id: string;
  title: string;
  description: string;
  items: DeconstructedItemMockup[];
}

export const CURATED_DECONSTRUCTION_PRESETS: CuratedLookPreset[] = [
  {
    id: 'minimalist-smart',
    title: 'Modern Minimalist Smart Casual',
    description: 'Clean silhouette balancing structured poplin cotton with relaxed pleated chinos and low-top leather shoes.',
    items: [
      {
        id: 'item-top-1',
        name: 'Crisp Oxford Cotton Shirt',
        category: 'tops',
        subcategory: 'button_down',
        primary_color: 'white',
        material: '100% poplin cotton',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.tops.white_shirt,
        confidence: 0.98,
      },
      {
        id: 'item-bottom-1',
        name: 'Relaxed Pleated Chinos',
        category: 'bottoms',
        subcategory: 'chinos',
        primary_color: 'khaki',
        material: 'washed cotton twill',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.bottoms.khaki_chinos,
        confidence: 0.96,
      },
      {
        id: 'item-shoes-1',
        name: 'Minimalist Leather Low-Tops',
        category: 'footwear',
        subcategory: 'sneakers',
        primary_color: 'white',
        material: 'calfskin leather',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.footwear.white_sneakers,
        confidence: 0.99,
      },
      {
        id: 'item-outer-1',
        name: 'Structured Wool Blend Overshirt',
        category: 'outerwear',
        subcategory: 'overshirt',
        primary_color: 'navy',
        material: 'wool blend',
        formality: 'smart_casual',
        seasons: ['fall', 'winter', 'spring'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.outerwear.navy_overshirt,
        confidence: 0.94,
      },
    ],
  },
  {
    id: 'parisian-trench',
    title: 'Parisian Tailored Trench Look',
    description: 'Effortless European proportions featuring a classic camel trench, ribbed knitwear, and polished penny loafers.',
    items: [
      {
        id: 'item-outer-2',
        name: 'Classic Gabardine Trench Coat',
        category: 'outerwear',
        subcategory: 'trench_coat',
        primary_color: 'camel',
        material: 'water-repellent gabardine',
        formality: 'smart_casual',
        seasons: ['spring', 'fall'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.outerwear.camel_trench,
        confidence: 0.97,
      },
      {
        id: 'item-top-2',
        name: 'Oversized Ribbed Knit Pullover',
        category: 'tops',
        subcategory: 'knitwear',
        primary_color: 'cream',
        material: 'extra-fine merino wool',
        formality: 'smart_casual',
        seasons: ['fall', 'winter', 'spring'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.tops.cream_knit,
        confidence: 0.98,
      },
      {
        id: 'item-bottom-2',
        name: 'Tailored Wide-Leg Trousers',
        category: 'bottoms',
        subcategory: 'trousers',
        primary_color: 'black',
        material: 'wool blend',
        formality: 'smart_casual',
        seasons: ['spring', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.bottoms.black_trousers,
        confidence: 0.95,
      },
      {
        id: 'item-shoes-2',
        name: 'Polished Leather Penny Loafers',
        category: 'footwear',
        subcategory: 'loafers',
        primary_color: 'black',
        material: 'smooth box leather',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.footwear.black_loafers,
        confidence: 0.96,
      },
    ],
  },
  {
    id: 'streetwear-denim',
    title: 'Contemporary Streetwear & Light Denim',
    description: 'Relaxed proportions combining a heavyweight boxy tee, vintage light-wash jeans, and retro court sneakers.',
    items: [
      {
        id: 'item-top-3',
        name: 'Heavyweight Boxy Cotton Tee',
        category: 'tops',
        subcategory: 't_shirt',
        primary_color: 'black',
        material: '280gsm organic cotton',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.tops.black_tee,
        confidence: 0.97,
      },
      {
        id: 'item-bottom-3',
        name: 'Vintage Light-Wash Loose Denim',
        category: 'bottoms',
        subcategory: 'jeans',
        primary_color: 'light_blue',
        material: '13oz non-stretch denim',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.bottoms.light_denim,
        confidence: 0.96,
      },
      {
        id: 'item-shoes-3',
        name: 'Retro Low-Profile Court Sneakers',
        category: 'footwear',
        subcategory: 'sneakers',
        primary_color: 'white',
        material: 'grained leather & suede',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.footwear.court_sneakers,
        confidence: 0.98,
      },
      {
        id: 'item-outer-3',
        name: 'Washed Canvas Utility Overshirt',
        category: 'outerwear',
        subcategory: 'utility_jacket',
        primary_color: 'olive',
        material: 'cotton canvas',
        formality: 'casual',
        seasons: ['spring', 'fall'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.outerwear.olive_jacket,
        confidence: 0.93,
      },
    ],
  },
  {
    id: 'summer-resort',
    title: 'Coastal Resort Linen Ensemble',
    description: 'Breathable lightweight layers in sage and ecru with suede espadrilles and handcrafted sunglasses.',
    items: [
      {
        id: 'item-top-4',
        name: 'Camp-Collar Relaxed Linen Shirt',
        category: 'tops',
        subcategory: 'camp_collar',
        primary_color: 'sage_green',
        material: '100% French linen',
        formality: 'smart_casual',
        seasons: ['spring', 'summer'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.tops.sage_linen,
        confidence: 0.97,
      },
      {
        id: 'item-bottom-4',
        name: 'Tailored Drawstring Linen Trousers',
        category: 'bottoms',
        subcategory: 'linen_pants',
        primary_color: 'ecru',
        material: 'pure washed linen',
        formality: 'smart_casual',
        seasons: ['spring', 'summer'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.bottoms.linen_pants,
        confidence: 0.95,
      },
      {
        id: 'item-shoes-4',
        name: 'Handcrafted Suede Espadrilles',
        category: 'footwear',
        subcategory: 'espadrilles',
        primary_color: 'sand',
        material: 'velveteen suede & jute',
        formality: 'casual',
        seasons: ['summer'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.footwear.sand_espadrilles,
        confidence: 0.98,
      },
      {
        id: 'item-acc-4',
        name: 'Tortoiseshell Acetate Sunglasses',
        category: 'accessories',
        subcategory: 'sunglasses',
        primary_color: 'amber',
        material: 'cellulose acetate',
        formality: 'smart_casual',
        seasons: ['spring', 'summer'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.accessories.amber_sunglasses,
        confidence: 0.99,
      },
    ],
  },
  {
    id: 'monochrome-evening',
    title: 'Monochrome Tailored Evening Look',
    description: 'High-contrast sophistication with an ivory silk camisole, sharp blazer, and pointed leather boots.',
    items: [
      {
        id: 'item-top-5',
        name: 'Draped Silk-Satin Camisole',
        category: 'tops',
        subcategory: 'camisole',
        primary_color: 'ivory',
        material: 'mulberry silk',
        formality: 'smart_casual',
        seasons: ['spring', 'summer', 'fall'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.tops.silk_camisole,
        confidence: 0.96,
      },
      {
        id: 'item-outer-5',
        name: 'Peak-Lapel Structured Blazer',
        category: 'outerwear',
        subcategory: 'blazer',
        primary_color: 'black',
        material: 'virgin wool crepe',
        formality: 'business',
        seasons: ['spring', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.outerwear.black_blazer,
        confidence: 0.97,
      },
      {
        id: 'item-bottom-5',
        name: 'High-Waist Wide Palazzo Trousers',
        category: 'bottoms',
        subcategory: 'palazzo',
        primary_color: 'black',
        material: 'heavy fluid drape twill',
        formality: 'formal',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.bottoms.wide_black,
        confidence: 0.95,
      },
      {
        id: 'item-shoes-5',
        name: 'Pointed-Toe Leather Ankle Boots',
        category: 'footwear',
        subcategory: 'boots',
        primary_color: 'black',
        material: 'nappa leather',
        formality: 'smart_casual',
        seasons: ['fall', 'winter', 'spring'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.footwear.black_boots,
        confidence: 0.97,
      },
    ],
  },
  {
    id: 'earth-heritage',
    title: 'Earth Tones & Cozy Heritage',
    description: 'Rich texture layering combining honeycomb cable knitwear, forest green corduroy, and tobacco Chelsea boots.',
    items: [
      {
        id: 'item-top-6',
        name: 'Honeycomb Cable-Knit Wool Sweater',
        category: 'tops',
        subcategory: 'knitwear',
        primary_color: 'caramel',
        material: 'Shetland lambswool',
        formality: 'smart_casual',
        seasons: ['fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.tops.caramel_knit,
        confidence: 0.98,
      },
      {
        id: 'item-bottom-6',
        name: 'Relaxed Tapered Corduroy Trousers',
        category: 'bottoms',
        subcategory: 'corduroy',
        primary_color: 'olive',
        material: 'wide-wale cotton corduroy',
        formality: 'smart_casual',
        seasons: ['fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.bottoms.green_corduroy,
        confidence: 0.95,
      },
      {
        id: 'item-shoes-6',
        name: 'Suede Chelsea Boots with Crepe Sole',
        category: 'footwear',
        subcategory: 'boots',
        primary_color: 'tobacco',
        material: 'oiled suede',
        formality: 'smart_casual',
        seasons: ['fall', 'winter', 'spring'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.footwear.tobacco_chelsea,
        confidence: 0.96,
      },
      {
        id: 'item-acc-6',
        name: 'Fringed Cashmere Scarf',
        category: 'accessories',
        subcategory: 'scarf',
        primary_color: 'camel',
        material: '100% woven cashmere',
        formality: 'smart_casual',
        seasons: ['fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.accessories.cashmere_scarf,
        confidence: 0.98,
      },
    ],
  },
  {
    id: 'athleisure-elevated',
    title: 'Elevated City Athleisure',
    description: 'Functional technical apparel tailored with minimalist aesthetics, performance joggers, and clean running shoes.',
    items: [
      {
        id: 'item-top-7',
        name: 'Technical Breathable Quarter-Zip',
        category: 'tops',
        subcategory: 'pullover',
        primary_color: 'slate_grey',
        material: 'thermal stretch knit',
        formality: 'athletic',
        seasons: ['spring', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.tops.grey_zip,
        confidence: 0.96,
      },
      {
        id: 'item-bottom-7',
        name: 'Tapered Performance Commuter Joggers',
        category: 'bottoms',
        subcategory: 'joggers',
        primary_color: 'charcoal',
        material: 'four-way stretch nylon',
        formality: 'athletic',
        seasons: ['spring', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.bottoms.charcoal_joggers,
        confidence: 0.97,
      },
      {
        id: 'item-shoes-7',
        name: 'Aerodynamic Cushioned Sneakers',
        category: 'footwear',
        subcategory: 'sneakers',
        primary_color: 'white',
        material: 'engineered mesh & EVA',
        formality: 'athletic',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.footwear.running_shoes,
        confidence: 0.98,
      },
      {
        id: 'item-acc-7',
        name: 'Structured Nylon Crossbody Sling',
        category: 'accessories',
        subcategory: 'bag',
        primary_color: 'black',
        material: 'Cordura ballistic nylon',
        formality: 'casual',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        mockup_image_url: STUDIO_MOCKUP_IMAGES.accessories.nylon_crossbody,
        confidence: 0.95,
      },
    ],
  },
];

/**
 * Deterministically deconstructs an outfit photo input into clean garment mockups.
 * Different uploaded photos yield different mockups!
 */
export function deconstructOutfitByInput(input: string): DeconstructOutfitResponse {
  // Fast hash of input string (base64 or URL)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const presetIndex = positiveHash % CURATED_DECONSTRUCTION_PRESETS.length;
  const basePreset = CURATED_DECONSTRUCTION_PRESETS[presetIndex];

  // Deep clone items with randomized unique IDs to ensure isolation
  const items: DeconstructedItemMockup[] = basePreset.items.map((item, idx) => ({
    ...item,
    id: `mock-${presetIndex}-${idx}-${Date.now().toString(36)}`,
  }));

  return {
    outfit_description: basePreset.description,
    detected_items_count: items.length,
    items,
  };
}
