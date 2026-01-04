
export type Physique = 'Slim' | 'Average' | 'Athletic' | 'Plus size' | 'Hourglass' | 'Curvy' | 'Default';
export type MalePhysique = 'Default' | 'Lean Athletic' | 'Mesomorph' | 'V-Taper' | 'Bulky' | 'Powerlifter' | 'Slim Fit' | 'Broad Shoulders' | 'Ectomorph' | 'Endomorph' | 'Stocky' | 'Rugged' | 'Dad Bod' | 'Hunk' | 'Viking Build';
export type MaleChest = 'Default' | 'Defined Pecs' | 'Broad' | 'Strong' | 'Flat' | 'Athletic' | 'Muscular Pecs' | 'Chiseled' | 'Massive' | 'Barreled';

export type BustSize = 'Flat' | 'Small' | 'Medium' | 'Large' | 'Big' | 'Natural' | 'Extra large' | 'Default';
export type Shot = 'Default' | 'Full Body' | 'Wide Shot' | 'Upper Body' | 'Portrait' | 'Close-up' | 'Macro' | 'Side Profile' | 'Low Angle' | 'High Angle' | 'Birds Eye' | 'Worms Eye' | 'Action Shot' | 'Candid Lifestyle' | 'Product Close-up' | 'Flatlay' | 'Commercial Angle';
export type AspectRatio = 'Default' | '1:1' | '4:5' | '3:4' | '2:3' | '9:16' | '16:9' | '21:9' | '3:2' | '4:3' | '5:4';
export type LightingStyle = 'Default' | 'Natural' | 'Studio' | 'Cinematic' | 'Soft' | 'High Contrast' | 'Golden Hour' | 'Neon' | 'Commercial' | 'Product Glow';
export type SkinTone = 'Auto' | 'Light' | 'Medium' | 'Tan' | 'Dark';
export type LipsColor = 'Default' | 'Classic Red' | 'Soft Pink' | 'Warm Nude' | 'Bright Coral' | 'Dark Berry' | 'Clear Gloss' | 'Deep Plum' | 'Peach';
export type MakeupStyle = 'Default' | 'Bold' | 'Glam' | 'Natural' | 'Natural Glow' | 'Evening Glam' | 'Soft Smokey' | 'Minimalist' | 'French Girl' | 'Editorial' | 'Vibrant' | 'Retro';
export type HairStyle = 'Default' | 'Sleek Straight' | 'Beach Waves' | 'Voluminous Curls' | 'Polished Bun' | 'High Ponytail' | 'Chic Bob' | 'Pixie Cut' | 'Side Part';
export type HairColor = 'Default' | 'Natural Black' | 'Dark Brown' | 'Honey Blonde' | 'Platinum' | 'Auburn' | 'Silver' | 'Rose Gold';
export type PhotoResolution = 'Standard Resolution' | 'High Resolution' | 'Low Resolution';
export type VisualStyle = 'Photorealistic' | 'Fashion Editorial' | 'Cinematic' | 'Vintage 90s' | 'Digital Art' | 'Oil Painting' | 'Sketch' | 'Vogue Style';

export type ProductSurface = 'Default' | 'Marble' | 'Polished Wood' | 'Dark Glass' | 'Frosted Metal' | 'Sand' | 'Water Surface' | 'Abstract Platform' | 'Concrete';
export type AdTheme = 'Luxury' | 'Minimalist' | 'High-Tech' | 'Organic' | 'Vibrant Pop' | 'Vintage' | 'Industrial' | 'Eco-Friendly';

export interface AppSettings {
  gender: 'Female' | 'Male';
  aiMakeup: boolean;
  makeupStyle: MakeupStyle;
  lipsColor: LipsColor;
  hairStyle: HairStyle;
  hairColor: HairColor;
  hijab: boolean;
  artistic: boolean;
  visualStyle: VisualStyle;
  deepVNeck: boolean;
  highFaceFidelity: boolean;
  skinSmoothing: boolean;
  backgroundBlur: boolean;
  lightingStyle: LightingStyle;
  skinTone: SkinTone;
  physique: Physique;
  malePhysique: MalePhysique;
  bustSize: BustSize;
  maleChest: MaleChest;
  shot: Shot;
  aspectRatio: AspectRatio;
  resolution: PhotoResolution;
  age: string;
  // Product specific
  productSurface: ProductSurface;
  adTheme: AdTheme;
  shadowIntensity: 'Natural' | 'Dramatic' | 'Soft';
  reflectionMode: boolean;
}

export type BackgroundType = 
  | 'Auto' 
  | 'Indoor' 
  | 'Outdoor' 
  | 'Park' 
  | 'Minimalist' 
  | 'Nature' 
  | 'Street' 
  | 'City' 
  | 'Cyberpunk' 
  | 'Beach' 
  | 'Office' 
  | 'Commercial Studio' 
  | 'Infinite White'
  | 'Luxury Villa'
  | 'Mountain'
  | 'Forest'
  | 'Sunset'
  | 'Desert'
  | 'Snowy'
  | 'Industrial Loft'
  | 'Coffee Shop'
  | 'Parisian Street'
  | 'Tropical Resort';
