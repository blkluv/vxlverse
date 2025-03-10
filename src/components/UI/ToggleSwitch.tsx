import React from "react";
import { motion } from "framer-motion";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle?: () => void;
  color?: "blue" | "green" | "amber" | "purple" | "cyan" | "red";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  labelPosition?: "left" | "right";
  id?: string;
  name?: string;
  ariaLabel?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  color = "blue",
  size = "md",
  disabled = false,
  label,
  labelPosition = "right",
  id,
  name,
  ariaLabel,
}) => {
  // Color configurations
  const colorVariants = {
    blue: {
      bg: "bg-gradient-to-r from-blue-400 to-blue-500",
      border: "border-blue-500/30",
      shadow: "shadow-blue-500/20",
      dot: "bg-gradient-to-br from-white to-blue-50",
    },
    green: {
      bg: "bg-gradient-to-r from-green-400 to-green-500",
      border: "border-green-500/30",
      shadow: "shadow-green-500/20",
      dot: "bg-gradient-to-br from-white to-green-50",
    },
    amber: {
      bg: "bg-gradient-to-r from-amber-400 to-amber-500",
      border: "border-amber-500/30",
      shadow: "shadow-amber-500/20",
      dot: "bg-gradient-to-br from-white to-amber-50",
    },
    purple: {
      bg: "bg-gradient-to-r from-purple-400 to-purple-500",
      border: "border-purple-500/30",
      shadow: "shadow-purple-500/20",
      dot: "bg-gradient-to-br from-white to-purple-50",
    },
    cyan: {
      bg: "bg-gradient-to-r from-cyan-400 to-cyan-500", // Fixed cyan gradient
      border: "border-cyan-500/30",
      shadow: "shadow-cyan-500/20",
      dot: "bg-gradient-to-br from-white to-cyan-50",
    },
    red: {
      bg: "bg-gradient-to-r from-red-400 to-red-500",
      border: "border-red-500/30",
      shadow: "shadow-red-500/20",
      dot: "bg-gradient-to-br from-white to-red-50",
    },
  };

  // Size configurations
  const sizeVariants = {
    sm: {
      track: "w-8 h-4",
      dot: "w-3 h-3",
      translate: "translate-x-4",
      padding: "p-0.5",
      text: "text-xs",
    },
    md: {
      track: "w-10 h-6",
      dot: "w-4 h-4",
      translate: "translate-x-4",
      padding: "p-1",
      text: "text-sm",
    },
    lg: {
      track: "w-12 h-7",
      dot: "w-5 h-5",
      translate: "translate-x-5",
      padding: "p-1",
      text: "text-base",
    },
  };
  
  // Animation variants for the dot
  const dotVariants = {
    off: { x: 0 },
    on: { x: size === 'sm' ? 16 : size === 'md' ? 20 : 28 }
  };

  const selectedColor = colorVariants[color];
  const selectedSize = sizeVariants[size];

  const generateUniqueId = () => {
    return id || `toggle-${Math.random().toString(36).substring(2, 9)}`;
  };
  
  const toggleId = generateUniqueId();
  
  const renderToggle = () => (
    <button
      id={toggleId}
      name={name}
      onClick={disabled ? undefined : onToggle}
      aria-pressed={isOn}
      aria-label={ariaLabel || label || 'Toggle'}
      disabled={disabled}
      className={`relative ${selectedSize.track} flex items-center rounded-full ${
        selectedSize.padding
      } cursor-pointer transition-colors duration-300 ${
        isOn
          ? `${selectedColor.bg} ${selectedColor.border} border`
          : "bg-slate-700/80 border border-slate-600/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500/50`}
      role="switch"
      type="button"
    >
      <motion.div
        className={`${selectedSize.dot} rounded-full shadow-md ${
          isOn ? `${selectedColor.dot} ${selectedColor.shadow}` : "bg-white"
        }`}
        initial={isOn ? "on" : "off"}
        animate={isOn ? "on" : "off"}
        variants={dotVariants}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );

  // If no label, just return the toggle
  if (!label) return renderToggle();

  // Return toggle with label
  return (
    <div
      className={`flex items-center gap-2 ${
        labelPosition === "left" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <label
        htmlFor={toggleId}
        className={`${selectedSize.text} text-slate-300 ${
          disabled ? "opacity-50" : ""
        } cursor-pointer select-none`}
      >
        {label}
      </label>
      {renderToggle()}
    </div>
  );
};
