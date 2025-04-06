import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: LucideIcon;
  to?: string;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      icon: Icon,
      children,
      to,
      isLoading,
      ...props
    },
    ref
  ) => {
    const sizes = {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    const baseStyles = `inline-flex items-center justify-center gap-2  font-medium transition-all duration-200 ${sizes[size]}`;

    const variants = {
      primary: `bg-blue-500 text-white hover:bg-blue-600 
                active:bg-blue-700 disabled:opacity-50 
                shadow-sm`,
      secondary: `bg-gray-700 text-white hover:bg-gray-800 
                  active:bg-gray-900 disabled:opacity-50 
                  border border-gray-600`,
      outline: `border border-gray-600 text-white hover:bg-gray-800/20 
                active:bg-transparent disabled:opacity-50 
                backdrop-blur-sm`,
      ghost: `text-white hover:bg-gray-800/20 
                active:bg-transparent disabled:opacity-50`,
    };

    const content = (
      <>
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent  animate-spin" />
        ) : (
          <>
            {Icon && <Icon className="w-5 h-5" strokeWidth={1.5} />}
            {children}
          </>
        )}
      </>
    );

    const buttonStyles = `${baseStyles} ${variants[variant]} ${className}`;

    if (to) {
      return (
        <Link to={to} className={buttonStyles}>
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={props.onClick}
        type={props.type}
        ref={ref}
        className={buttonStyles}
        disabled={isLoading || props.disabled}
      >
        {content}
      </button>
    );
  }
);
