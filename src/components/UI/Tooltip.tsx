import React, { useState, useRef, useEffect } from "react";
import { Portal } from "../Portal";

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
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isVisible && childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      const tooltipPos = { top: 0, left: 0 };

      switch (position) {
        case "top":
          tooltipPos.top = rect.top - 8;
          tooltipPos.left = rect.left + rect.width / 2;
          break;
        case "bottom":
          tooltipPos.top = rect.bottom + 8;
          tooltipPos.left = rect.left + rect.width / 2;
          break;
        case "left":
          tooltipPos.top = rect.top + rect.height / 2;
          tooltipPos.left = rect.left - 8;
          break;
        case "right":
          tooltipPos.top = rect.top + rect.height / 2;
          tooltipPos.left = rect.right + 8;
          break;
      }

      setTooltipPosition(tooltipPos);
    }
  }, [isVisible, position]);

  // Position classes based on position prop
  const getTooltipStyles = () => {
    const baseStyles = {
      position: "fixed",
      zIndex: 9999,
      transform: "",
    } as React.CSSProperties;

    switch (position) {
      case "top":
        baseStyles.transform = "translate(-50%, -100%)";
        break;
      case "bottom":
        baseStyles.transform = "translate(-50%, 10px)";
        break;
      case "left":
        baseStyles.transform = "translate(-100%, -50%)";
        break;
      case "right":
        baseStyles.transform = "translate(10px, -50%)";
        break;
    }

    return baseStyles;
  };

  // Arrow position classes
  const getArrowStyles = () => {
    const baseStyles = {
      position: "absolute",
      width: "8px",
      height: "8px",
      background: "#1e293b", // bg-slate-800
      transform: "rotate(45deg)",
      border: "1px solid #334155", // border-slate-700
    } as React.CSSProperties;

    switch (position) {
      case "top":
        baseStyles.bottom = "-4px";
        baseStyles.left = "50%";
        baseStyles.marginLeft = "-4px";
        baseStyles.borderTop = "none";
        baseStyles.borderLeft = "none";
        break;
      case "bottom":
        baseStyles.top = "-4px";
        baseStyles.left = "50%";
        baseStyles.marginLeft = "-4px";
        baseStyles.borderBottom = "none";
        baseStyles.borderRight = "none";
        break;
      case "left":
        baseStyles.right = "-4px";
        baseStyles.top = "50%";
        baseStyles.marginTop = "-4px";
        baseStyles.borderLeft = "none";
        baseStyles.borderBottom = "none";
        break;
      case "right":
        baseStyles.left = "-4px";
        baseStyles.top = "50%";
        baseStyles.marginTop = "-4px";
        baseStyles.borderRight = "none";
        baseStyles.borderTop = "none";
        break;
    }

    return baseStyles;
  };

  return (
    <div
      ref={childRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && content && (
        <Portal>
          <div
            className="px-2 py-1 text-xs font-medium text-white bg-slate-800 border border-slate-700 shadow-lg shadow-black/20 whitespace-nowrap sm"
            style={{
              ...getTooltipStyles(),
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              backdropFilter: "blur(8px)",
            }}
          >
            {content}
            <div style={getArrowStyles()} />
          </div>
        </Portal>
      )}
    </div>
  );
};
