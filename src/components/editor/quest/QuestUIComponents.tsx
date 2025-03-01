import React from "react";

// Section Header component
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-indigo-500/20 border border-blue-500/40 shadow-sm">
        <div className="text-blue-300">{icon}</div>
      </div>
      <span className="text-xs font-semibold text-slate-100 tracking-wide">
        {title}
      </span>
    </div>
  );
}

// Tab Button component
interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 relative ${
        isActive
          ? "text-blue-50 bg-gradient-to-r from-blue-600/20 to-blue-500/10 shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <div
          className={`transition-colors duration-200 ${
            isActive ? "text-blue-300" : ""
          }`}
        >
          {icon}
        </div>
        {label}
      </div>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400" />
      )}
    </button>
  );
}
