
import React from 'react';
import { 
  Sofa, Sun, TreeDeciduous, Square, Leaf, MapPin, Building2, Wand2, Cpu, 
  Palmtree, Briefcase, Camera, Home, Mountain, Trees, Sunrise, Snowflake, 
  Warehouse, Coffee, Globe, CloudSun 
} from 'lucide-react';
import { BackgroundType } from '../types';

interface BackgroundGridProps {
  selected: BackgroundType;
  onSelect: (type: BackgroundType) => void;
}

const backgrounds: { type: BackgroundType; icon: React.ElementType }[] = [
  { type: 'Auto', icon: Wand2 },
  { type: 'Indoor', icon: Sofa },
  { type: 'Outdoor', icon: Sun },
  { type: 'Park', icon: TreeDeciduous },
  { type: 'Minimalist', icon: Square },
  { type: 'Nature', icon: Leaf },
  { type: 'Street', icon: MapPin },
  { type: 'City', icon: Building2 },
  { type: 'Cyberpunk', icon: Cpu },
  { type: 'Beach', icon: Palmtree },
  { type: 'Office', icon: Briefcase },
  { type: 'Commercial Studio', icon: Camera },
  { type: 'Infinite White', icon: Square },
  { type: 'Luxury Villa', icon: Home },
  { type: 'Mountain', icon: Mountain },
  { type: 'Forest', icon: Trees },
  { type: 'Sunset', icon: Sunrise },
  { type: 'Desert', icon: CloudSun },
  { type: 'Snowy', icon: Snowflake },
  { type: 'Industrial Loft', icon: Warehouse },
  { type: 'Coffee Shop', icon: Coffee },
  { type: 'Parisian Street', icon: Globe },
  { type: 'Tropical Resort', icon: Palmtree },
];

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {backgrounds.map(({ type, icon: Icon }) => {
        const isSelected = selected === type;
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
              isSelected 
                ? 'bg-[#2563EB] text-white ios-shadow scale-105 z-10' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E5E7EB]'
            }`}
          >
            <Icon size={18} className="mb-2" />
            <span className="text-[9px] font-black uppercase tracking-tight text-center leading-tight">{type}</span>
          </button>
        );
      })}
    </div>
  );
};
