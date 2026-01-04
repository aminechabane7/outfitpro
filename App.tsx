
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Wand2, Loader2, Download, Trash2, X, Sparkles, Shirt, Plus, Layers, 
  ShoppingBag, Library, RefreshCw, UserCircle2, LogOut, Mail, Lock, 
  CheckCircle2, Info, ScanFace, Palette, Settings, User, CreditCard, HelpCircle,
  Zap, Compass, ChevronLeft, ChevronRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { createClient } from '@supabase/supabase-js';
import { UploadCard } from './components/UploadCard';
import { Switch } from './components/Switch';
import { Select } from './components/Select';
import { BackgroundGrid } from './components/BackgroundGrid';
import { AppSettings, BackgroundType, PhotoResolution, VisualStyle } from './types';

const SUPABASE_URL = "https://porlgbisilooqluhxhqq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvcmxnYmlzaWxvb3FsdWh4aHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NjQ5ODksImV4cCI6MjA4MjE0MDk4OX0.xZE_6VNTEtOYxq1CXWdwabGXimtAMOfQwDpsFGmEWNg";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface GeneratedResult {
  id: string;
  url: string;
  timestamp: string;
  type: Tab;
}

type Tab = 'studio' | 'creative' | 'product' | 'gallery' | 'settings';

const PRESET_MODELS = [
  { id: 'm1', url: 'https://images.unsplash.com/photo-1539109136881-3be06109e2c6?auto=format&fit=crop&q=80&w=400', label: 'Editorial' },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400', label: 'Streetwear' },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', label: 'Classic' },
  { id: 'm4', url: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=400', label: 'Male Casual' },
  { id: 'm5', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400', label: 'Male Portrait' },
  { id: 'm6', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400', label: 'Sportswear' },
  { id: 'm7', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', label: 'High Fashion' },
  { id: 'm8', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', label: 'Male Rugged' },
  { id: 'm9', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400', label: 'Street Style' },
  { id: 'm10', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400', label: 'Male Fashion' },
];

const PRESET_OUTFITS = [
  { id: 'o1', url: 'https://images.unsplash.com/photo-1539008835279-434693931cc6?auto=format&fit=crop&q=80&w=400', label: 'Silk Dress' },
  { id: 'o2', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400', label: 'Winter Jacket' },
  { id: 'o3', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=400', label: 'Linen Top' },
  { id: 'o4', url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=400', label: 'Men\'s Suit' },
  { id: 'o5', url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=400', label: 'Casual Wear' },
  { id: 'o6', url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=400', label: 'Evening Gown' },
  { id: 'o7', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400', label: 'Summer Set' },
  { id: 'o8', url: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&q=80&w=400', label: 'Active Wear' },
  { id: 'o9', url: 'https://images.unsplash.com/photo-1589483232748-515c025575bc?auto=format&fit=crop&q=80&w=400', label: 'Denim Look' },
  { id: 'o10', url: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f6f2?auto=format&fit=crop&q=80&w=400', label: 'Boho Style' },
];

const FASHION_SUGGESTIONS = [
  "Cyberpunk streetwear with neon accents",
  "High-luxury silk ballgown in a marble hall",
  "Vintage 90s grunge look in a dark alley",
  "Bohemian summer festival set with fringe",
  "Futuristic metallic space suit in orbit",
  "Classic Parisian chic with a red beret",
  "Avant-garde sculptural fashion editorial"
];

const resizeImage = (base64Str: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Fetch failed for preset image", e);
    throw e;
  }
};

const base64ToBlob = (base64: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('studio');
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [outfitImages, setOutfitImages] = useState<string[]>([]);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isLayeringEnabled, setIsLayeringEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('Initializing');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isOutfitLoading, setIsOutfitLoading] = useState(false);
  
  const [isBodyShapingEnabled, setIsBodyShapingEnabled] = useState(false);

  const [activeModalItem, setActiveModalItem] = useState<GeneratedResult | null>(null);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedOutfitIds, setSelectedOutfitIds] = useState<string[]>([]);
  
  const [creativePrompt, setCreativePrompt] = useState('');

  const modelScrollRef = useRef<HTMLDivElement>(null);
  const outfitScrollRef = useRef<HTMLDivElement>(null);
  const outfitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const getPathFromUrl = (url: string) => {
    if (!url || url.startsWith('data:')) return null;
    try {
      const urlObj = new URL(url);
      const pathname = decodeURIComponent(urlObj.pathname);
      const bucketName = 'gallery-images';
      const segments = pathname.split('/');
      const bucketIndex = segments.indexOf(bucketName);
      if (bucketIndex !== -1 && bucketIndex < segments.length - 1) {
        return segments.slice(bucketIndex + 1).join('/');
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const fetchGallery = async () => {
    if (!session?.user) return;
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.from('gallery').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      if (error) throw error;
      if (!data) return;
      const filePaths = data.map(item => getPathFromUrl(item.image_url)).filter(Boolean) as string[];
      if (filePaths.length > 0) {
        const { data: signedData, error: signedError } = await supabase.storage.from('gallery-images').createSignedUrls(filePaths, 3600);
        if (!signedError && signedData) {
          const signedMap = new Map(signedData.map(s => [s.path, s.signedUrl]));
          setResults(data.map(item => {
            const path = getPathFromUrl(item.image_url);
            const signedUrl = path ? signedMap.get(path) : null;
            return { id: String(item.id), url: signedUrl || item.image_url, timestamp: item.created_at, type: item.type as Tab || 'studio' };
          }));
          return;
        }
      }
      setResults(data.map(item => ({ id: String(item.id), url: item.image_url, timestamp: item.created_at, type: item.type as Tab || 'studio' })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const [settings, setSettings] = useState<AppSettings>({
    gender: 'Female', aiMakeup: true, makeupStyle: 'Default', lipsColor: 'Default',
    hairStyle: 'Default', hairColor: 'Default', hijab: false, artistic: false, visualStyle: 'Photorealistic',
    deepVNeck: false, highFaceFidelity: true, skinSmoothing: true, backgroundBlur: false,
    lightingStyle: 'Default', skinTone: 'Auto', physique: 'Default', malePhysique: 'Default',
    bustSize: 'Default', maleChest: 'Default', shot: 'Full Body', aspectRatio: '9:16',
    resolution: 'High Resolution', age: '24', productSurface: 'Default', adTheme: 'Minimalist',
    shadowIntensity: 'Natural', reflectionMode: true
  });

  const [background, setBackground] = useState<BackgroundType>('Auto');

  const updateSetting = useCallback((key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    let res;
    if (isSignUp) {
      res = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    } else {
      res = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    }
    if (res.error) alert(res.error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setResults([]);
  };

  const handleModelUpload = async (base64: string) => {
    const resized = await resizeImage(base64);
    setModelImage(resized);
    setSelectedModelId(null);
    setIsModelLoading(false);
  };

  const handleProductUpload = async (base64: string) => {
    const resized = await resizeImage(base64);
    setProductImage(resized);
  };

  const handleAddOutfit = async (base64: string, presetId: string | null = null) => {
    const resized = await resizeImage(base64);
    if (isLayeringEnabled) {
      if (outfitImages.length >= 3) {
        alert("Max 3 layers reached.");
        return;
      }
      setOutfitImages(prev => [...prev, resized]);
      if (presetId) setSelectedOutfitIds(prev => [...prev, presetId]);
    } else {
      setOutfitImages([resized]);
      setSelectedOutfitIds(presetId ? [presetId] : []);
    }
    setIsOutfitLoading(false);
  };

  const handleSelectExampleModel = async (model: typeof PRESET_MODELS[0]) => {
    setIsModelLoading(true);
    setSelectedModelId(model.id);
    try {
      const base64 = await urlToBase64(model.url);
      handleModelUpload(base64);
      setSelectedModelId(model.id);
    } catch (e) {
      alert("Error loading model library.");
      setIsModelLoading(false);
      setSelectedModelId(null);
    }
  };

  const handleSelectExampleOutfit = async (outfit: typeof PRESET_OUTFITS[0]) => {
    setIsOutfitLoading(true);
    try {
      const base64 = await urlToBase64(outfit.url);
      handleAddOutfit(base64, outfit.id);
    } catch (e) {
      alert("Error loading outfit library.");
      setIsOutfitLoading(false);
    }
  };

  const removeOutfit = (index: number) => {
    setOutfitImages(prev => prev.filter((_, i) => i !== index));
    setSelectedOutfitIds(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (activeTab === 'gallery' || activeTab === 'settings' || isGenerating || !session) return;
    if (activeTab === 'studio' && (!modelImage || outfitImages.length === 0)) return;
    if (activeTab === 'product' && !productImage) return;
    if (activeTab === 'creative' && !creativePrompt) return;
    
    setIsGenerating(true);
    setGenerationStep('Analyzing Assets...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let promptText = '';
      let contents: any = {};
      
      const supportedRatiosMap: Record<string, string> = {
        '1:1': '1:1', '4:5': '3:4', '3:4': '3:4', '2:3': '3:4', '9:16': '9:16', '16:9': '16:9', '21:9': '16:9', '3:2': '4:3', '4:3': '4:3', '5:4': '1:1', 'Default': '1:1'
      };
      const sdkAspectRatio: any = supportedRatiosMap[settings.aspectRatio] || '1:1';

      const frameConstraint = `MANDATORY FRAME COMPOSITION (ULTRA-STRICT ANTI-CROP): 
      - CAMERA POSITION: EXTREME LONG SHOT! Pull the camera back to a very far distance. 
      - FULL BODY SILHOUETTE: The entire human figure, from the top of the head to the tip of the shoes, MUST be visible. 
      - SHOW FEET: The shoes and the ground they stand on MUST be fully rendered in the bottom half of the frame. 
      - 40% EMPTY SPACE PADDING: Ensure a massive empty margin of at least 40% between the subject and all image borders (top, bottom, left, right). 
      - ZERO CLIPPING: No part of the clothing, hair, or body should touch the edge of the image. 
      - CENTERED: Position the subject precisely in the center, occupying only the middle 60% of the image space.`;

      const angleInstruction = settings.shot === 'Full Body' 
        ? `MANDATORY SHOT TYPE: Full-length EXTREME WIDE SHOT. Head-to-toe visibility. Zoom out extensively to ensure the entire body and footwear are fully contained with room to spare.`
        : settings.shot !== 'Default' 
          ? `MANDATORY SHOT TYPE: ${settings.shot}. Ensure the subject is fully centered and contained within the frame borders with substantial safe-zone padding.`
          : '';

      const anatomyDirective = (isBodyShapingEnabled) ? (
        settings.gender === 'Female' 
          ? `ANATOMICAL CALIBRATION: Reconstruct the body strictly as ${settings.physique} physique with ${settings.bustSize} bust proportions.` 
          : `ANATOMICAL CALIBRATION: Reconstruct the build strictly as ${settings.malePhysique} physique with ${settings.maleChest} chest profile.`
      ) : '';

      if (activeTab === 'studio') {
        const modelMatch = modelImage?.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!modelMatch) throw new Error("Invalid model image");
        const outfitParts = outfitImages.map(img => {
          const match = img.match(/^data:(image\/\w+);base64,(.+)$/);
          return match ? { inlineData: { mimeType: match[1], data: match[2] } } : null;
        }).filter(Boolean);
        
        const hairDirective = settings.hairStyle !== 'Default' ? `HAIR: ${settings.hairStyle}.` : '';
        const hairColorDirective = settings.hairColor !== 'Default' ? `HAIR COLOR: ${settings.hairColor}.` : '';
        const lipDirective = settings.lipsColor !== 'Default' ? `LIPS: ${settings.lipsColor}.` : '';
        const makeupDirective = (settings.aiMakeup && settings.gender === 'Female') ? `MAKEUP: ${settings.makeupStyle}.` : '';
        
        setGenerationStep('Synthesizing Fashion...');
        
        promptText = `${frameConstraint}
        ${angleInstruction}
        Professional Virtual Try-On Studio. 
        TASK: Replace original clothing with the NEW outfit parts provided. 
        MANDATORY: Preserve total body integrity. DO NOT CROP ANY PART OF THE HEAD OR FEET.
        ${anatomyDirective}
        Visual Aesthetic: ${settings.visualStyle}. Lighting: ${settings.lightingStyle}. Environment: ${background}. 
        Details: ${hairDirective} ${hairColorDirective} ${lipDirective} ${makeupDirective}
        Hyper-realistic, 8k resolution, professional photography, wide lens.`;
        
        contents = { parts: [{ inlineData: { mimeType: modelMatch[1], data: modelMatch[2] } }, ...outfitParts, { text: promptText }] };
      } else if (activeTab === 'product') {
        const productMatch = productImage?.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!productMatch) throw new Error("Invalid product image");
        promptText = `Premium product ad. Theme: ${settings.adTheme}. Surface: ${settings.productSurface}. Lighting: ${settings.lightingStyle}. Visual Style: ${settings.visualStyle}. 
        MANDATORY: Center the product with 30% empty space padding around all edges. No cropping.`;
        contents = { parts: [{ inlineData: { mimeType: productMatch[1], data: productMatch[2] } }, { text: promptText }] };
      } else if (activeTab === 'creative') {
        setGenerationStep('Imagining Design...');
        promptText = `${frameConstraint}
        ${angleInstruction}
        Fashion Design Concept. 
        CONCEPT: ${creativePrompt}. 
        ${anatomyDirective}
        Style: ${settings.visualStyle}. Environment: ${background}. Lighting: ${settings.lightingStyle}. 
        MANDATORY: Extreme wide angle shot, head-to-toe visibility, massive padding, no cropping.
        Photorealistic 8k, editorial quality.`;
        contents = { parts: [{ text: promptText }] };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', 
        contents: contents,
        config: { imageConfig: { aspectRatio: sdkAspectRatio as any } }
      });

      setGenerationStep('Finalizing Image...');

      let genBase64 = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const p of response.candidates[0].content.parts) {
          if (p.inlineData) {
            genBase64 = `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`;
            break;
          }
        }
      }

      if (genBase64) {
        setGenerationStep('Saving to Vault...');
        const blob = base64ToBlob(genBase64);
        const fileName = `${session.user.id}/${Date.now()}.png`;
        const uploadRes = await supabase.storage.from('gallery-images').upload(fileName, blob);
        if (uploadRes.error) throw uploadRes.error;
        const { data: { publicUrl } } = supabase.storage.from('gallery-images').getPublicUrl(fileName);
        const dbRes = await supabase.from('gallery').insert([{
          user_id: session.user.id, image_url: publicUrl, type: activeTab, created_at: new Date().toISOString()
        }]).select().single();
        if (dbRes.error) throw dbRes.error;
        
        setActiveModalItem({ id: String(dbRes.data.id), url: genBase64, timestamp: dbRes.data.created_at, type: activeTab });
        fetchGallery();
      }
    } catch (err: any) {
      alert("Synthesis failed: " + (err.message || "Unknown Error"));
    } finally {
      setIsGenerating(false);
      setGenerationStep('Initializing');
    }
  };

  const deleteResult = async (id: string) => {
    try {
      const item = results.find(r => String(r.id) === String(id)) || activeModalItem;
      if (!item) return;
      const path = getPathFromUrl(item.url);
      const queryId = isNaN(Number(id)) ? id : Number(id);
      const { error: dbError } = await supabase.from('gallery').delete().eq('id', queryId);
      if (dbError) throw dbError;
      setResults(prev => prev.filter(r => String(r.id) !== String(id)));
      if (activeModalItem?.id === id) setActiveModalItem(null);
      if (path) await supabase.storage.from('gallery-images').remove([path]);
    } catch (err: any) {
      alert('Delete failed. Please retry.');
    }
  };

  const downloadResult = async (url: string, id: string) => {
    if (!url) return;
    if (url.startsWith('data:')) {
      const a = document.createElement('a'); a.href = url; a.download = `studio-${id}.png`; a.click();
      return;
    }
    const res = await fetch(url);
    const blob = await res.blob();
    const bUrl = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = bUrl; a.download = `studio-${id}.png`; a.click();
    URL.revokeObjectURL(bUrl);
  };

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const physOptions = ['Default', 'Slim', 'Average', 'Athletic', 'Plus size', 'Hourglass', 'Curvy'];
  const malePhysOptions = ['Default', 'Lean Athletic', 'Mesomorph', 'V-Taper', 'Bulky', 'Powerlifter', 'Slim Fit', 'Broad Shoulders', 'Rugged', 'Dad Bod', 'Hunk', 'Viking Build'];
  const bustOptions = ['Default', 'Flat', 'Small', 'Medium', 'Large', 'Big', 'Natural', 'Extra large'];
  const maleChestOptions = ['Default', 'Defined Pecs', 'Broad', 'Strong', 'Flat', 'Athletic', 'Muscular Pecs', 'Chiseled', 'Massive', 'Barreled'];
  const shotOptions = ['Default', 'Full Body', 'Wide Shot', 'Upper Body', 'Portrait', 'Close-up', 'Macro', 'Side Profile', 'Low Angle', 'High Angle', 'Birds Eye', 'Worms Eye', 'Action Shot', 'Candid Lifestyle'];
  const ratioOptions = ['Default', '1:1', '4:5', '3:4', '2:3', '9:16', '16:9', '21:9', '3:2', '4:3', '5:4'];
  const skinOptions = ['Auto', 'Light', 'Medium', 'Tan', 'Dark'];
  const hairOptions = ['Default', 'Sleek Straight', 'Beach Waves', 'Voluminous Curls', 'Polished Bun', 'High Ponytail', 'Chic Bob', 'Pixie Cut', 'Side Part'];
  const hairColorOptions = ['Default', 'Natural Black', 'Dark Brown', 'Honey Blonde', 'Platinum', 'Auburn', 'Silver', 'Rose Gold'];
  const lipsOptions = ['Default', 'Classic Red', 'Soft Pink', 'Warm Nude', 'Bright Coral', 'Dark Berry', 'Clear Gloss', 'Deep Plum', 'Peach'];
  const makeupOptions = ['Default', 'Bold', 'Glam', 'Natural', 'Natural Glow', 'Evening Glam', 'Soft Smokey', 'Minimalist', 'French Girl', 'Editorial', 'Vibrant', 'Retro'];
  const resolutionOptions: PhotoResolution[] = ['Standard Resolution', 'High Resolution', 'Low Resolution'];
  const styleOptions: VisualStyle[] = ['Photorealistic', 'Fashion Editorial', 'Cinematic', 'Vintage 90s', 'Digital Art', 'Oil Painting', 'Sketch', 'Vogue Style'];

  const isStudioInputsReady = modelImage && outfitImages.length > 0;
  const isProductInputsReady = !!productImage;
  const isCreativeReady = creativePrompt.length > 3;
  const isReady = activeTab === 'studio' ? isStudioInputsReady : (activeTab === 'product' ? isProductInputsReady : activeTab === 'creative' ? isCreativeReady : false);

  if (!session && !authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2563EB]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-400/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="w-full max-w-md bg-white rounded-[48px] shadow-2xl border border-[#E5E7EB] overflow-hidden p-10 space-y-10 animate-in fade-in slide-in-from-bottom duration-700 relative z-10">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#2563EB] to-indigo-500 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-2xl shadow-blue-100">
              <Sparkles size={40} />
            </div>
            <h1 className="text-3xl font-black text-[#1F2937] tracking-tight">Outfit Studio Pro</h1>
            <p className="text-sm font-medium text-gray-500 max-w-[200px] mx-auto leading-relaxed">High-fidelity virtual fashion laboratory.</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1 group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[24px] pl-14 pr-6 py-4 text-[15px] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 font-medium" placeholder="name@example.com" required />
              </div>
            </div>
            <div className="space-y-1 group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[24px] pl-14 pr-6 py-4 text-[15px] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 font-medium" placeholder="••••••••" required />
              </div>
            </div>
            <button type="submit" disabled={authLoading} className="w-full py-5 bg-[#1F2937] text-white rounded-[24px] font-black text-[13px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
              {authLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Create Account' : 'Initialize Studio')}
            </button>
          </form>
          <div className="text-center pt-2">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-[11px] font-bold text-[#2563EB] uppercase tracking-widest hover:underline">{isSignUp ? 'New? Sign Up' : 'Member? Sign In'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex justify-center overflow-x-hidden font-sans text-[#1F2937]">
      <div className="w-full xl:max-w-7xl bg-white min-h-screen relative shadow-2xl flex flex-col pb-40">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB] flex items-center justify-between px-6 py-5">
          <button onClick={handleLogout} className="p-2.5 bg-[#F7F8FA] text-gray-400 hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-full transition-all"><LogOut size={18} /></button>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[17px] font-bold tracking-tight text-[#1F2937] leading-none">Outfit Studio Pro</h1>
            <span className={`text-[9px] uppercase tracking-[0.2em] font-black mt-1.5 ${
              activeTab === 'studio' ? 'text-primary' : 
              activeTab === 'product' ? 'text-success' : 
              activeTab === 'creative' ? 'text-purple-600' :
              activeTab === 'settings' ? 'text-orange-500' :
              'text-gray-400'}`}>
              {activeTab === 'studio' ? 'Fashion Synthesis' : 
               activeTab === 'product' ? 'Commercial Lab' : 
               activeTab === 'creative' ? 'Text to Fashion' :
               activeTab === 'settings' ? 'Account Preferences' :
               'The Vault'}
            </span>
          </div>
          <div className="w-10 flex justify-end">
            <button onClick={() => setActiveTab('settings')} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeTab === 'settings' ? 'bg-primary text-white' : 'bg-blue-100 text-primary'}`}>
              {(session?.user?.email?.[0] || 'D').toUpperCase()}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-5 pt-6 space-y-12 no-scrollbar">
          {activeTab === 'studio' && (
            <section className="animate-in fade-in slide-in-from-left duration-300 space-y-10 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:space-y-0">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter">01</span>
                      <h2 className="text-[17px] font-extrabold text-[#1F2937] tracking-tight">Stage Assets</h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateSetting('gender', settings.gender === 'Female' ? 'Male' : 'Female')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${settings.gender === 'Male' ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg' : 'bg-pink-50 border-pink-100 text-pink-500'}`}>
                        <UserCircle2 size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{settings.gender}</span>
                      </button>
                      <button onClick={() => setIsLayeringEnabled(!isLayeringEnabled)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${isLayeringEnabled ? 'bg-[#1F2937] border-[#1F2937] text-white' : 'bg-white border-[#E5E7EB] text-gray-400'}`}>
                        <Layers size={12} /><span className="text-[9px] font-black uppercase tracking-widest">Layers</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <UploadCard label="Model" image={modelImage} onUpload={handleModelUpload} onClear={() => { setModelImage(null); setSelectedModelId(null); }} isActive={!!modelImage} isLoading={isModelLoading} />
                    <div className="flex-1">
                      {!isLayeringEnabled ? (
                        <UploadCard label="Outfit" image={outfitImages[0] || null} onUpload={handleAddOutfit} onClear={() => { setOutfitImages([]); setSelectedOutfitIds([]); }} isActive={outfitImages.length > 0} isLoading={isOutfitLoading} />
                      ) : (
                        <div className="space-y-2">
                          {outfitImages.map((img, idx) => (
                            <div key={idx} className="aspect-square relative group">
                              <div className="w-full h-full rounded-2xl overflow-hidden ios-shadow border-2 border-[#2563EB]"><img src={img} className="w-full h-full object-cover" /><button onClick={() => removeOutfit(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1.5 backdrop-blur-md"><X size={10} /></button></div>
                            </div>
                          ))}
                          {outfitImages.length < 3 && (
                            <button onClick={() => outfitInputRef.current?.click()} className="w-full py-4 flex items-center justify-center gap-2 border-2 border-dashed border-[#2563EB]/20 bg-[#2563EB]/5 text-[#2563EB] rounded-xl hover:bg-[#2563EB]/10 transition-colors"><Plus size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Add Outfit</span></button>
                          )}
                        </div>
                      )}
                      <input type="file" ref={outfitInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => handleAddOutfit(r.result as string); r.readAsDataURL(f); } }} accept="image/*" className="hidden" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-[#E5E7EB]">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><UserCircle2 size={18} className="text-[#2563EB]" /><h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Model Library</h3></div>
                        <div className="flex gap-1">
                          <button onClick={() => scrollContainer(modelScrollRef, 'left')} className="p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-primary transition-colors border border-gray-100 shadow-sm"><ChevronLeft size={16} /></button>
                          <button onClick={() => scrollContainer(modelScrollRef, 'right')} className="p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-primary transition-colors border border-gray-100 shadow-sm"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                      <div ref={modelScrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
                        {PRESET_MODELS.map((model) => {
                          const isSelected = selectedModelId === model.id;
                          return (
                            <button key={model.id} onClick={() => handleSelectExampleModel(model)} className="flex-shrink-0 w-24 group relative">
                              <div className={`aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all bg-gray-50 relative ${isSelected ? 'border-[#2563EB] ring-4 ring-[#2563EB]/20 scale-105' : 'border-transparent hover:border-[#2563EB]/40'}`}>
                                <img src={model.url} className="w-full h-full object-cover" />
                                {isSelected && <div className="absolute inset-0 bg-[#2563EB]/20 flex items-center justify-center"><CheckCircle2 className="text-white drop-shadow-lg" size={32} /></div>}
                              </div>
                              <span className={`text-[9px] font-black uppercase block text-center mt-2 ${isSelected ? 'text-[#2563EB]' : 'text-gray-400'}`}>{model.label}</span>
                            </button>
                          );
                        })}
                      </div>
                   </div>
                   
                   <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Shirt size={18} className="text-[#2563EB]" /><h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Outfit Library</h3></div>
                        <div className="flex gap-1">
                          <button onClick={() => scrollContainer(outfitScrollRef, 'left')} className="p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-primary transition-colors border border-gray-100 shadow-sm"><ChevronLeft size={16} /></button>
                          <button onClick={() => scrollContainer(outfitScrollRef, 'right')} className="p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-primary transition-colors border border-gray-100 shadow-sm"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                      <div ref={outfitScrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
                        {PRESET_OUTFITS.map((outfit) => {
                          const isSelected = selectedOutfitIds.includes(outfit.id);
                          return (
                            <button key={outfit.id} onClick={() => handleSelectExampleOutfit(outfit)} className="flex-shrink-0 w-24 group relative">
                              <div className={`aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all bg-gray-50 relative ${isSelected ? 'border-[#2563EB] ring-4 ring-[#2563EB]/20 scale-105' : 'border-transparent hover:border-[#2563EB]/40'}`}>
                                <img src={outfit.url} className="w-full h-full object-cover" />
                                {isSelected && <div className="absolute inset-0 bg-[#2563EB]/20 flex items-center justify-center"><CheckCircle2 className="text-white drop-shadow-lg" size={32} /></div>}
                              </div>
                              <span className={`text-[9px] font-black uppercase block text-center mt-2 ${isSelected ? 'text-[#2563EB]' : 'text-gray-400'}`}>{outfit.label}</span>
                            </button>
                          );
                        })}
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter">02</span>
                      <h2 className="text-[17px] font-extrabold text-[#1F2937] tracking-tight">Styling & Calibration</h2>
                    </div>
                    <button 
                      onClick={() => setIsBodyShapingEnabled(!isBodyShapingEnabled)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                        isBodyShapingEnabled 
                          ? 'bg-primary border-primary text-white shadow-lg' 
                          : 'bg-white border-borderMain text-gray-400'
                      }`}
                    >
                      <ScanFace size={14} />
                      {isBodyShapingEnabled ? 'Body Shaping: ON' : 'Body Shaping: OFF'}
                    </button>
                  </div>
                  <div className="ios-card p-6 space-y-6 ios-shadow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 border-b border-[#E5E7EB] pb-6">
                      <div className="space-y-1">
                        <Switch label="Face Fidelity" isPrimary checked={settings.highFaceFidelity} onChange={(v) => updateSetting('highFaceFidelity', v)} />
                        {settings.gender === 'Female' && <Switch label="AI Makeup" checked={settings.aiMakeup} onChange={(v) => updateSetting('aiMakeup', v)} />}
                        <Switch label="Skin Smoothing" checked={settings.skinSmoothing} onChange={(v) => updateSetting('skinSmoothing', v)} />
                      </div>
                      <div className="space-y-1">
                        <Switch label="BG Blur" checked={settings.backgroundBlur} onChange={(v) => updateSetting('backgroundBlur', v)} />
                        <Switch label="Deep V-Neck" checked={settings.deepVNeck} onChange={(v) => updateSetting('deepVNeck', v)} />
                        <Switch label="Hijab Mode" checked={settings.hijab} onChange={(v) => updateSetting('hijab', v)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Select label="Visual Style" value={settings.visualStyle} options={styleOptions} onChange={(v) => updateSetting('visualStyle', v)} />
                      <Select label="Hair Style" value={settings.hairStyle} options={hairOptions} onChange={(v) => updateSetting('hairStyle', v)} />
                      <Select label="Hair Color" value={settings.hairColor} options={hairColorOptions} onChange={(v) => updateSetting('hairColor', v)} />
                      {settings.gender === 'Female' && <Select label="Makeup Style" value={settings.makeupStyle} options={makeupOptions} onChange={(v) => updateSetting('makeupStyle', v)} />}
                      {settings.gender === 'Female' && <Select label="Lips Color" value={settings.lipsColor} options={lipsOptions} onChange={(v) => updateSetting('lipsColor', v)} />}
                      
                      {isBodyShapingEnabled && (
                        <>
                          {settings.gender === 'Female' ? (
                            <>
                              <Select label="Physique" value={settings.physique} options={physOptions} onChange={(v) => updateSetting('physique', v)} />
                              <Select label="Bust Size" value={settings.bustSize} options={bustOptions} onChange={(v) => updateSetting('bustSize', v)} />
                            </>
                          ) : (
                            <>
                              <Select label="Physique" value={settings.malePhysique} options={malePhysOptions} onChange={(v) => updateSetting('malePhysique', v)} />
                              <Select label="Chest" value={settings.maleChest} options={maleChestOptions} onChange={(v) => updateSetting('maleChest', v)} />
                            </>
                          )}
                        </>
                      )}

                      <Select label="Skin Tone" value={settings.skinTone} options={skinOptions} onChange={(v) => updateSetting('skinTone', v)} />
                      <div className="flex flex-col gap-1.5"><label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Age</label><input type="number" value={settings.age} onChange={(e) => updateSetting('age', e.target.value)} className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-bold" /></div>
                      <Select label="Aspect Ratio" value={settings.aspectRatio} options={ratioOptions} onChange={(v) => updateSetting('aspectRatio', v)} />
                      <Select label="Resolution" value={settings.resolution} options={resolutionOptions} onChange={(v) => updateSetting('resolution', v)} />
                      <Select label="Shot Angle" value={settings.shot} options={shotOptions} onChange={(v) => updateSetting('shot', v)} />
                      <Select label="Lighting Style" value={settings.lightingStyle} options={['Default', 'Natural', 'Studio', 'Cinematic', 'Golden Hour']} onChange={(v) => updateSetting('lightingStyle', v)} />
                    </div>
                    <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Environment Setting</label>
                       <BackgroundGrid selected={background} onSelect={setBackground} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'creative' && (
            <section className="animate-in fade-in slide-in-from-top duration-300 space-y-10 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:space-y-0">
               <div className="space-y-6">
                 <div className="flex items-center gap-2">
                   <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter">01</span>
                   <h2 className="text-[17px] font-extrabold text-[#1F2937] tracking-tight">Fashion Concept</h2>
                 </div>
                 <div className="ios-card p-8 ios-shadow space-y-6">
                    <div className="relative">
                       <Zap className="absolute top-4 left-4 text-purple-600 opacity-20" size={32} />
                       <textarea 
                        value={creativePrompt}
                        onChange={(e) => setCreativePrompt(e.target.value)}
                        placeholder="Describe your design vision..."
                        className="w-full h-48 bg-background border border-borderMain rounded-[32px] p-8 text-[16px] font-medium focus:outline-none focus:ring-8 focus:ring-purple-600/5 resize-none placeholder:text-gray-300 leading-relaxed"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {FASHION_SUGGESTIONS.map((s, i) => (
                        <button key={i} onClick={() => setCreativePrompt(s)} className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95">{s.split(' ').slice(0, 3).join(' ')}...</button>
                      ))}
                    </div>
                 </div>
               </div>
               <div className="space-y-6">
                 <div className="flex items-center gap-2">
                   <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter">02</span>
                   <h2 className="text-[17px] font-extrabold text-[#1F2937] tracking-tight">Technical Spec</h2>
                 </div>
                 <div className="ios-card p-6 space-y-6 ios-shadow">
                    <div className="grid grid-cols-2 gap-6">
                      <Select label="Model Type" value={settings.gender} options={['Female', 'Male']} onChange={(v) => updateSetting('gender', v)} />
                      <Select label="Art Style" value={settings.visualStyle} options={styleOptions} onChange={(v) => updateSetting('visualStyle', v)} />
                      <Select label="Aspect Ratio" value={settings.aspectRatio} options={ratioOptions} onChange={(v) => updateSetting('aspectRatio', v)} />
                      <Select label="Framing" value={settings.shot} options={shotOptions} onChange={(v) => updateSetting('shot', v)} />
                    </div>
                 </div>
               </div>
            </section>
          )}

          {activeTab === 'gallery' && (
            <section className="animate-in fade-in zoom-in duration-300 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#1F2937] tracking-tight">The Vault</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Access your generated assets</p>
                </div>
                <button onClick={fetchGallery} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-colors">
                  <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={14} />
                  Refresh
                </button>
              </div>
              
              {results.length === 0 ? (
                <div className="py-20 text-center space-y-4 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-gray-300"><Library size={32} /></div>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No captures found in vault</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {results.map((res) => (
                    <div 
                      key={res.id} 
                      onClick={() => setActiveModalItem(res)}
                      className="group relative aspect-[3/4] rounded-[32px] overflow-hidden ios-shadow bg-gray-100 cursor-pointer"
                    >
                      <div className="w-full h-full bg-gray-200/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                        <img src={res.url} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                        <button onClick={(e) => { e.stopPropagation(); downloadResult(res.url, res.id); }} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-xl"><Download size={20} /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteResult(res.id); }} className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 hover:scale-110 transition-transform shadow-xl"><Trash2 size={20} /></button>
                      </div>
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">{res.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="animate-in fade-in slide-in-from-bottom duration-300 max-w-2xl mx-auto space-y-10">
              <div className="ios-card p-10 ios-shadow flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-black shadow-xl shadow-primary/20">
                  {(session?.user?.email?.[0] || 'D').toUpperCase()}
                </div>
                <h2 className="text-xl font-black text-[#1F2937] tracking-tight">{session?.user?.email}</h2>
                <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-600 rounded-[24px] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all">Sign Out</button>
              </div>
            </section>
          )}
        </main>

        {activeTab !== 'gallery' && activeTab !== 'settings' && (
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-xs px-6">
            <button
              onClick={handleGenerate}
              disabled={!isReady || isGenerating}
              className={`w-full py-6 rounded-full font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 ${
                isReady && !isGenerating 
                  ? (activeTab === 'studio' ? 'bg-[#2563EB] text-white hover:bg-blue-700' : 
                     activeTab === 'product' ? 'bg-[#16A34A] text-white hover:bg-green-700' :
                     'bg-purple-600 text-white hover:bg-purple-700') 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{generationStep}</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  <span>{activeTab === 'studio' ? 'Synthesize Outfit' : activeTab === 'product' ? 'Generate Ad' : 'Launch Design'}</span>
                </>
              )}
            </button>
          </div>
        )}

        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1F2937]/90 backdrop-blur-2xl px-6 py-4 rounded-[32px] border border-white/10 shadow-2xl flex items-center gap-8 z-50">
          <button onClick={() => setActiveTab('studio')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'studio' ? 'text-white scale-110' : 'text-gray-500 hover:text-gray-300'}`}><Sparkles size={18} /><span className="text-[9px] font-black uppercase tracking-widest">Studio</span></button>
          <button onClick={() => setActiveTab('creative')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'creative' ? 'text-white scale-110' : 'text-gray-500 hover:text-gray-300'}`}><Palette size={18} /><span className="text-[9px] font-black uppercase tracking-widest">Design</span></button>
          <button onClick={() => setActiveTab('product')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'product' ? 'text-white scale-110' : 'text-gray-500 hover:text-gray-300'}`}><ShoppingBag size={18} /><span className="text-[9px] font-black uppercase tracking-widest">Ads</span></button>
          <button onClick={() => setActiveTab('gallery')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'gallery' ? 'text-white scale-110' : 'text-gray-500 hover:text-gray-300'}`}><Library size={18} /><span className="text-[9px] font-black uppercase tracking-widest">Vault</span></button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'settings' ? 'text-white scale-110' : 'text-gray-500 hover:text-gray-300'}`}><Settings size={18} /><span className="text-[9px] font-black uppercase tracking-widest">User</span></button>
        </nav>

        {activeModalItem && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl flex flex-col h-[85vh]">
              <button onClick={() => setActiveModalItem(null)} className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/30 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-colors"><X size={20} /></button>
              
              <div className="flex-1 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3MhQhc6EKEbGAAYY4P8MAnH7wSByWJChKp0J0YyMAQwwwAA8ixAiTXY6VAAAAABJRU5ErkJggg==')] bg-repeat relative flex items-center justify-center p-4 min-h-0">
                <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={activeModalItem.url} 
                  className="max-w-full max-h-full object-contain relative z-10 shadow-2xl" 
                  alt="Generated result" 
                />
                </div>
              </div>

              <div className="p-8 flex items-center justify-between bg-white border-t border-gray-100 relative z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#1F2937]">Synthesis Successful</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Full Aspect Displayed</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => downloadResult(activeModalItem.url, activeModalItem.id)} className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"><Download size={24} /></button>
                  <button onClick={() => deleteResult(activeModalItem.id)} className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={24} /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
