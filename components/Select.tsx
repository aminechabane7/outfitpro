import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: any) => void;
}

export const Select: React.FC<SelectProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background border border-borderMain rounded-xl px-4 py-3 text-[15px] appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold text-textMain cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
};