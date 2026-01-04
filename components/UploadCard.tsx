import React, { useRef } from 'react';
import { UploadCloud, X, CheckCircle2, Loader2 } from 'lucide-react';

interface UploadCardProps {
  label: string;
  image: string | null;
  onUpload: (base64: string) => void;
  onClear: () => void;
  isActive?: boolean;
  isLoading?: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({ label, image, onUpload, onClear, isActive, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 aspect-square relative group">
      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl border-primary/20 bg-primary/5 text-primary animate-pulse">
          <Loader2 className="animate-spin mb-2" size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest">Processing...</span>
        </div>
      ) : image ? (
        <div className={`w-full h-full rounded-2xl overflow-hidden ios-shadow border-4 transition-all ${isActive ? 'border-primary shadow-primary/20' : 'border-borderMain'} relative`}>
          <img src={image} alt={label} className="w-full h-full object-cover" />
          
          <div className="absolute top-2 right-2 flex gap-2">
             <button
              onClick={onClear}
              className="bg-black/60 text-white rounded-full p-2 backdrop-blur-md hover:bg-black transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {isActive && (
            <div className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-1.5 shadow-xl animate-in zoom-in duration-300">
              <CheckCircle2 size={18} />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all ${
            isActive 
              ? 'border-primary bg-primary/5 text-primary' 
              : 'border-borderMain bg-background text-gray-400 hover:border-primary/40'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
             <UploadCloud className="text-gray-400 group-hover:text-primary transition-colors" size={28} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </button>
      )}
    </div>
  );
};