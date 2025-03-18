import React, { useState, useRef, useEffect } from "react";

interface SliderProps {
  value: number[];
  min: number;
  max: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  className?: string;
}

export function Slider({
  value = [0],
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className = "",
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState(value[0]);

  // Update internal value when prop changes
  useEffect(() => {
    setCurrentValue(value[0]);
  }, [value]);

  const calculateValueFromPosition = (clientX: number) => {
    if (!trackRef.current) return currentValue;

    const trackRect = trackRef.current.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const trackLeft = trackRect.left;

    // Calculate percentage position
    let percentage = (clientX - trackLeft) / trackWidth;

    // Clamp percentage between 0 and 1
    percentage = Math.max(0, Math.min(1, percentage));

    // Calculate value based on min, max, and step
    let rawValue = min + percentage * (max - min);

    // Apply step
    const steppedValue = Math.round(rawValue / step) * step;

    // Ensure value is within bounds
    return Math.max(min, Math.min(max, steppedValue));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    // Update value immediately on click
    const newValue = calculateValueFromPosition(e.clientX);
    setCurrentValue(newValue);
    onValueChange?.([newValue]);

    // Add event listeners for drag
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newValue = calculateValueFromPosition(e.clientX);
    setCurrentValue(newValue);
    onValueChange?.([newValue]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Calculate thumb position as percentage
  const thumbPosition = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
      <div
        ref={trackRef}
        className="relative h-1.5 w-full grow overflow-hidden -full bg-slate-800/80 border border-slate-700/50 cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          style={{ width: `${thumbPosition}%` }}
        />
      </div>
      <div
        ref={thumbRef}
        className={`absolute block h-3.5 w-3.5 -full border border-cyan-500/50 bg-gradient-to-br from-cyan-500/80 to-blue-500/80 shadow-lg shadow-cyan-900/20 cursor-grab ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{
          left: `calc(${thumbPosition}% - 7px)`,
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
