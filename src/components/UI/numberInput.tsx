import React, { forwardRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Input, InputProps } from "./input";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface NumberInputProps extends Omit<InputProps, "type" | "onChange"> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  allowNegative?: boolean;
  precision?: number;
  showControls?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({
    value,
    defaultValue,
    min,
    max,
    step = 1,
    onChange,
    allowNegative = false,
    precision = 0,
    showControls = false,
    className,
    containerClassName,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = useState<number | undefined>(() => {
      if (value !== undefined) return value;
      if (defaultValue !== undefined) return defaultValue;
      return undefined;
    });

    // Format value for display
    const formatValue = (val: number | undefined): string => {
      if (val === undefined) return '';
      return precision > 0 ? val.toFixed(precision) : val.toString();
    };

    // Parse input value
    const parseValue = (val: string): number | undefined => {
      if (val === '') return undefined;
      
      let parsedValue = precision > 0 ? parseFloat(val) : parseInt(val, 10);
      
      if (isNaN(parsedValue)) return internalValue;
      
      // Apply constraints
      if (!allowNegative && parsedValue < 0) parsedValue = 0;
      if (min !== undefined && parsedValue < min) parsedValue = min;
      if (max !== undefined && parsedValue > max) parsedValue = max;
      
      return parsedValue;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseValue(e.target.value);
      setInternalValue(newValue);
      if (newValue !== undefined) onChange?.(newValue);
    };

    const increment = () => {
      const currentValue = internalValue ?? 0;
      const newValue = Math.min(max ?? Infinity, currentValue + step);
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const decrement = () => {
      const currentValue = internalValue ?? 0;
      const newValue = Math.max(min ?? (allowNegative ? -Infinity : 0), currentValue - step);
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div className={containerClassName}>
        <div className="relative">
          <Input
            type="text"
            value={formatValue(value !== undefined ? value : internalValue)}
            onChange={handleChange}
            className={cn(
              showControls && "pr-8",
              className
            )}
            containerClassName=""
            ref={ref}
            {...props}
          />
          
          {showControls && (
            <div className="absolute right-1 top-0 h-full flex flex-col">
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  increment();
                }}
                className="flex items-center justify-center h-1/2 w-6 text-slate-400 hover:text-slate-200"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  decrement();
                }}
                className="flex items-center justify-center h-1/2 w-6 text-slate-400 hover:text-slate-200"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
