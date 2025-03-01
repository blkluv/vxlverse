import React, { forwardRef, useId, useState } from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  description?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      error,
      label,
      id,
      description,
      containerClassName,
      icon,
      rightIcon,
      type = "text",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const descriptionId = description
      ? `description-${generatedId}`
      : undefined;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-300"
          >
            {label}
          </label>
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

          <input
            id={inputId}
            type={type}
            aria-describedby={descriptionId}
            aria-invalid={!!error}
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
              "w-full h-9 px-3 py-2 text-sm bg-slate-800/80 border border-slate-700/80",
              "text-slate-200 placeholder:text-slate-500",
              "focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40",
              "transition-colors ",
              icon && "pl-8",
              rightIcon && "pr-8",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
