import { LucideIcon } from "lucide-react";

interface SettingItemProps {
  icon: LucideIcon;
  label: string;
  description: string;
  type: "toggle" | "select";
  value: boolean | string;
  options?: string[];
  onChange: (value: boolean | string) => void;
}

export function SettingItem({
  icon: Icon,
  label,
  description,
  type,
  value,
  options = [],
  onChange,
}: SettingItemProps) {
  return (
    <div className="flex items-start justify-between p-4  bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex gap-4">
        <div className="p-2  bg-blue-500/10">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white mb-1">{label}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {type === "toggle" ? (
        <button
          onClick={() => onChange(!value as boolean)}
          className={`relative w-12 h-6 transition-colors  ${
            value ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 transition-transform bg-white  ${
              value ? "translate-x-6" : ""
            }`}
          />
        </button>
      ) : (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-1.5  bg-white/5 text-white border border-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
