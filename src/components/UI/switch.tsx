import React from "react";
import { motion } from "framer-motion";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: "left" | "right";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "amber" | "purple" | "cyan";
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  labelPosition = "right",
  disabled = false,
  size = "md",
  color = "cyan",
  className = "",
}: SwitchProps) {
  // Color configurations
  const colorVariants = {
    blue: {
      active: "bg-gradient-to-r from-blue-400 to-blue-500",
      border: "border-blue-500/30",
      shadow: "shadow-blue-500/20",
      dot: "bg-gradient-to-br from-white to-blue-50",
    },
    green: {
      active: "bg-gradient-to-r from-green-400 to-green-500",
      border: "border-green-500/30",
      shadow: "shadow-green-500/20",
      dot: "bg-gradient-to-br from-white to-green-50",
    },
    amber: {
      active: "bg-gradient-to-r from-amber-400 to-amber-500",
      border: "border-amber-500/30",
      shadow: "shadow-amber-500/20",
      dot: "bg-gradient-to-br from-white to-amber-50",
    },
    purple: {
      active: "bg-gradient-to-r from-purple-400 to-purple-500",
      border: "border-purple-500/30",
      shadow: "shadow-purple-500/20",
      dot: "bg-gradient-to-br from-white to-purple-50",
    },
    cyan: {
      active: "bg-gradient-to-r from-cyan-400 to-blue-500",
      border: "border-cyan-500/30",
      shadow: "shadow-cyan-500/20",
      dot: "bg-gradient-to-br from-white to-cyan-50",
    },
  };

  // Size configurations
  const sizeVariants = {
    sm: {
      track: "w-8 h-4",
      dot: "w-3 h-3",
      padding: "p-0.5",
      text: "text-xs",
    },
    md: {
      track: "w-10 h-6",
      dot: "w-4 h-4",
      padding: "p-1",
      text: "text-sm",
    },
    lg: {
      track: "w-12 h-7",
      dot: "w-5 h-5",
      padding: "p-1",
      text: "text-base",
    },
  };

  const selectedColor = colorVariants[color];
  const selectedSize = sizeVariants[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const renderSwitch = () => (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex ${
        selectedSize.track
      } flex-shrink-0 items-center -full ${
        selectedSize.padding
      } transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        checked
          ? `${selectedColor.active} ${selectedColor.border} border`
          : "bg-slate-700/80 border border-slate-600/50"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <motion.span
        className={`${selectedSize.dot} -full shadow-md ${
          checked ? `${selectedColor.dot} ${selectedColor.shadow}` : "bg-white"
        }`}
        initial={false}
        animate={{
          x: checked ? "100%" : "0%",
          translateX: checked ? "-100%" : "0%",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  // If no label, just return the switch
  if (!label) return renderSwitch();

  // Return switch with label
  return (
    <div
      className={`inline-flex items-center gap-2 ${
        labelPosition === "left" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <span
        className={`${selectedSize.text} text-slate-300 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {label}
      </span>
      {renderSwitch()}
    </div>
  );
}
