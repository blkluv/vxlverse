import React, { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  error?: string;
  label?: string;
  description?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className = "",
    error,
    label,
    id,
    description,
    containerClassName,
    icon,
    options,
    ...props
  }, ref) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;
    const descriptionId = description ? `description-${generatedId}` : undefined;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-slate-300"
          >
            {label}
          </label>
        )}

        {description && (
          <p
            id={descriptionId}
            className="text-[0.8rem] text-slate-400"
          >
            {description}
          </p>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 z-10">
              {icon}
            </div>
          )}

          <select
            id={selectId}
            aria-describedby={descriptionId}
            aria-invalid={!!error}
            onKeyDown={(e) => {
              e.stopPropagation();
              props.onKeyDown?.(e);
            }}
            onClick={(e) => {
              e.stopPropagation();
              props.onClick?.(e);
            }}
            className={cn(
              "w-full h-9 px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80",
              "text-slate-200 placeholder:text-slate-500",
              "focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40",
              "transition-colors rounded-sm appearance-none",
              "pr-8", // Space for the chevron
              icon && "pl-8",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
