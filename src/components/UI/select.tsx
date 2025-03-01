import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from ".";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  onValueChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.onChange?.(e);
      if (onValueChange) {
        onValueChange(e.target.value);
      }
    };

    return (
      <div className="relative h-full">
        <select
          className={cn(
            `w-full h-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80 
                     text-slate-200 placeholder:text-slate-500
                     focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40
                     transition-colors  appearance-none pr-8`,
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown size={16} />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
