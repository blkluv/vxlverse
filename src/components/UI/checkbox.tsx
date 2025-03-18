import React, { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, description, error, id, containerClassName, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || `checkbox-${generatedId}`;
    const descriptionId = description ? `description-${generatedId}` : undefined;

    return (
      <div className={cn("flex items-start", containerClassName)}>
        <div className="flex items-center h-5">
          <div className="relative flex items-center justify-center">
            <input
              id={checkboxId}
              type="checkbox"
              aria-describedby={descriptionId}
              aria-invalid={!!error}
              className={cn(
                "h-4 w-4  border-slate-700/80 bg-slate-800/80 text-blue-500",
                "focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40",
                "transition-colors",
                error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                "appearance-none",
                className
              )}
              ref={ref}
              {...props}
            />
            {props.checked && (
              <Check size={12} className="absolute text-blue-500 pointer-events-none" />
            )}
          </div>
        </div>

        <div className="ml-2">
          {label && (
            <label htmlFor={checkboxId} className="text-sm font-medium text-slate-300">
              {label}
            </label>
          )}

          {description && (
            <p id={descriptionId} className="text-[0.8rem] text-slate-400">
              {description}
            </p>
          )}

          {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
