import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  isPrimary?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, isPrimary = false }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-[13px] font-black uppercase tracking-wider ${isPrimary ? 'text-primary' : 'text-[#1F2937]'}`}>
        {label}
      </span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
          checked ? (isPrimary ? 'bg-primary' : 'bg-[#16A34A]') : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};