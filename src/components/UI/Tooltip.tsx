import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1",
    left: "right-full top-1/2 transform -translate-x-2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform translate-x-2 -translate-y-1/2 ml-1",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && content && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-800 border border-slate-700  shadow-lg shadow-black/20 whitespace-nowrap ${positionClasses[position]}`}
          style={{ backdropFilter: "blur(8px)" }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-slate-800 border-t border-l border-slate-700 transform rotate-45 ${
              position === "top"
                ? "top-full -translate-y-1 left-1/2 -translate-x-1/2"
                : position === "bottom"
                ? "bottom-full translate-y-1 left-1/2 -translate-x-1/2"
                : position === "left"
                ? "left-full -translate-x-1 top-1/2 -translate-y-1/2"
                : "right-full translate-x-1 top-1/2 -translate-y-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
};
