import React, { forwardRef, useId, useState } from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  description?: string;
  containerClassName?: string;
  showCharCount?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      error,
      label,
      id,
      description,
      containerClassName,
      showCharCount,
      maxLength,
      icon,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || `textarea-${generatedId}`;
    const descriptionId = description
      ? `description-${generatedId}`
      : undefined;

    // Track character count if showCharCount is enabled
    const [charCount, setCharCount] = useState(() => {
      if (typeof value === "string") return value.length;
      if (typeof defaultValue === "string") return defaultValue.length;
      return 0;
    });

    // Handle onChange to update character count
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {/* Label and character count */}
        {(label || (showCharCount && maxLength)) && (
          <div className="flex justify-between items-center">
            {label && (
              <label
                htmlFor={textareaId}
                className="block text-xs font-medium text-slate-300"
              >
                {label}
              </label>
            )}

            {showCharCount && maxLength && (
              <span
                className={cn(
                  "text-xs",
                  charCount > maxLength ? "text-red-400" : "text-slate-400"
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        {description && (
          <p id={descriptionId} className="text-[0.8rem] text-slate-400">
            {description}
          </p>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}

          <textarea
            id={textareaId}
            aria-describedby={descriptionId}
            aria-invalid={!!error}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            maxLength={maxLength}
            onKeyDown={(e) => {
              e.stopPropagation();
              props.onKeyDown?.(e);
            }}
            onKeyUp={(e) => {
              e.stopPropagation();
              props.onKeyUp?.(e);
            }}
            onKeyPress={(e) => {
              e.stopPropagation();
              props.onKeyPress?.(e);
            }}
            onClick={(e) => {
              e.stopPropagation();
              props.onClick?.(e);
            }}
            className={cn(
              "w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80",
              "text-slate-200 placeholder:text-slate-500",
              "focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40",
              "resize-none transition-colors ",
              icon && "pl-8",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
